package com.slobodian.mylibrary.dao.impls;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Service;

import com.slobodian.mylibrary.dao.interfaces.LibraryDAO;
import com.slobodian.mylibrary.dao.objects.Author;
import com.slobodian.mylibrary.dao.objects.Book;
import com.slobodian.mylibrary.dao.objects.Work;
import com.slobodian.mylibrary.util.Pair;

@Service
public class SQLiteLibraryDAO implements LibraryDAO {
	
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
	private SimpleJdbcInsert insertBook;
	private SimpleJdbcInsert insertAuthor;
	private SimpleJdbcInsert insertIds;
	private LinkedHashMap<Integer, Book> books;
	private LinkedHashMap<Integer, Author> authors;
	
	@Autowired
	public void setDataSource(DataSource dataSource) {
		this.namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(dataSource);
		this.insertAuthor = new SimpleJdbcInsert(dataSource)
				.withTableName("authors")
				.usingColumns("first_name", "last_name")
				.usingGeneratedKeyColumns("id");
		this.insertBook = new SimpleJdbcInsert(dataSource)
				.withTableName("books")
				.usingColumns("title", "genre", "year")
				.usingGeneratedKeyColumns("id");
		this.insertIds = new SimpleJdbcInsert(dataSource)
				.withTableName("bridging_table")
				.usingColumns("author_id", "book_id");
		getData();
	}
	
	@Override
	public void getData() {
		authors = getAllAuthors();
		books = getAllBooks();
		setAuthors4Books();
	}
	
	// обробка введених імен авторів
	@Override
	public void insertAuthor(String firstName, String lastName, int bookId) {
		int authorId = 0;
		boolean alreadyExists = false;
		
		// перевірити, чи такий автор вже існує, якщо так, то запам'ятати id
		for (Map.Entry<Integer, Author> entry : authors.entrySet()) {
			if (firstName.equalsIgnoreCase(entry.getValue().getFirstName()) && lastName.equalsIgnoreCase(entry.getValue().getLastName())) {
				authorId = entry.getValue().getId();
				alreadyExists = true;
			}
		}
		
		// якщо це новий автор, записати його в БД і отримати id
		if (!alreadyExists) {
			MapSqlParameterSource params = new MapSqlParameterSource();
			params.addValue("first_name", firstName);
			params.addValue("last_name", lastName);
			authorId = insertAuthor.executeAndReturnKey(params).intValue();
		}

		// асоціювати автора з доданою книгою
		MapSqlParameterSource bridgeParams = new MapSqlParameterSource();
		bridgeParams.addValue("author_id", authorId);
		bridgeParams.addValue("book_id", bookId);
		insertIds.execute(bridgeParams);
	}
	
	@Override
	public int insertBook(String title, String genre, int year) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("title", title);
		params.addValue("genre", genre);
		params.addValue("year", year);
		return insertBook.executeAndReturnKey(params).intValue();
	}
	
	@Override
	public void updateAuthor(int id, String firstName, String lastName) {
		String sql = "update authors set first_name=:first_name, last_name=:last_name where id=:id";
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("id", id);
		params.addValue("first_name", firstName);
		params.addValue("last_name", lastName);
		namedParameterJdbcTemplate.update(sql, params);
	}
	
	@Override
	public void updateBook(int id, String title, String genre, int year) {
		String sql = "update books set title=:title, genre=:genre, year=:year where id=:id";
		String sql2 = "delete from bridging_table where book_id=:book_id";
		
		// оновлення даних про книгу
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("id", id);
		params.addValue("title", title);
		params.addValue("genre", genre);
		params.addValue("year", year);
		namedParameterJdbcTemplate.update(sql, params);
		
		// відв'язання від неї всіх авторів
		namedParameterJdbcTemplate.update(sql2, new MapSqlParameterSource("book_id", id));
	}
	
	
	@Override
	public void deleteAuthor(int id) {
		
		// видалити з БД всі праці автора
		for (Work work:authors.get(id).getWorks()) {
			deleteBookInternal(work.getId());
		}
		
		// видалити з БД самого автора
		deleteAuthorInternal(id);
		
		// видалити авторів, які були співавторами книг автора
		// і не мають власних книг
		deleteUnusedAuthors();
	}

	@Override
	public void deleteBook(int id) {
		
		// видалити з БД саму книгу
		deleteBookInternal(id);
		
		//видалити тих її авторів, які не мають більше книг
		deleteUnusedAuthors();
	}

	@Override
	public LinkedHashMap<Integer, Author> getAuthors() {
		return authors;
	}
	
	@Override
	public LinkedHashMap<Integer, Book> getBooks() {
		return books;
	}
	

	@Override
	public List<String> getFirstNames() {
		String sql = "select first_name from authors order by first_name";
		return namedParameterJdbcTemplate.getJdbcOperations().queryForList(sql, String.class);
	}

	@Override
	public List<String> getLastNames() {
		String sql = "select last_name from authors order by last_name";
		return namedParameterJdbcTemplate.getJdbcOperations().queryForList(sql, String.class);
	}
	
	@Override
	public void deleteUnusedAuthors() {
		// видалення авторів, у яких не залишилося книг
		
		String sqlA = "select id from authors";
		String sqlB = "select author_id from bridging_table";
		
		List<Integer> listA = namedParameterJdbcTemplate.getJdbcOperations().queryForList(sqlA, Integer.class);
		List<Integer> listB = namedParameterJdbcTemplate.getJdbcOperations().queryForList(sqlB, Integer.class);
		
		for (int id:listA) {
			if (!listB.contains(id)) {
				deleteAuthorInternal(id);
			}
		}
	}

	private LinkedHashMap<Integer, Author> getAllAuthors(){
		String sql = "select * from authors order by last_name";
		LinkedHashMap<Integer, Author> authors = new LinkedHashMap<Integer, Author>();
	
		List<Map<String,Object>> rows = namedParameterJdbcTemplate.getJdbcOperations().queryForList(sql);
		for (Map<String,Object> row : rows) {
			int id = (Integer)row.get("id");
			
			Author author = new Author();
			author.setId(id);
			author.setFirstName((String)row.get("first_name"));
			author.setLastName((String)row.get("last_name"));
			authors.put(id, author);
		}
		
		return authors;
	}
	
	private LinkedHashMap<Integer, Book> getAllBooks(){
		String sql = "select * from books order by title";
		LinkedHashMap<Integer, Book> books = new LinkedHashMap<Integer, Book>();
	
		List<Map<String,Object>> rows = namedParameterJdbcTemplate.getJdbcOperations().queryForList(sql);
		for (Map<String,Object> row : rows) {
			int id = (Integer)row.get("id");
			
			Book book = new Book();
			book.setId(id);
			book.setTitle((String)row.get("title"));
			book.setGenre((String)row.get("genre"));
			book.setYear((Integer)row.get("year"));
			books.put(id, book);
		}
		
		return books;
	}
	
	private void setAuthors4Books() {
		String sql = "select * from bridging_table";
		
		List<Pair> bridge = namedParameterJdbcTemplate.query(sql, new BridgeResultSetExtractor());
		
		for (Pair pair: bridge) {
			Book book = books.get(pair.getBookId());
			Author author = authors.get(pair.getAuthorId());
			book.addAuthor(author);
			author.addBook(book);
		}
	}
	
	private void deleteAuthorInternal(int id) {
		String sql = "delete from authors where id=:id";
		namedParameterJdbcTemplate.update(sql, new MapSqlParameterSource("id", id));
	}
	
	private void deleteBookInternal(int id) {
		String sql = "delete from books where id=:id";
		String sql2 = "delete from bridging_table where book_id=:book_id";
		
		namedParameterJdbcTemplate.update(sql, new MapSqlParameterSource("id", id));
		namedParameterJdbcTemplate.update(sql2, new MapSqlParameterSource("book_id", id));
	}

	private static final class BridgeResultSetExtractor implements ResultSetExtractor<List<Pair>> {

		@Override
		public List<Pair> extractData(ResultSet rs) throws SQLException, DataAccessException {
			List<Pair> list = new ArrayList<Pair>();
			while(rs.next()) {
				list.add(new Pair(rs.getInt("author_id"), rs.getInt("book_id")));
			}
			return list;
		}
	}
}
