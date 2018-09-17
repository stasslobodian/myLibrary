package com.slobodian.mylibrary;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.slobodian.mylibrary.dao.interfaces.LibraryDAO;
import com.slobodian.mylibrary.dao.objects.Author;
import com.slobodian.mylibrary.dao.objects.Book;
import com.slobodian.mylibrary.dao.objects.Names;
import com.slobodian.mylibrary.dao.objects.Person;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping({"/api"})
public class LibraryController {
	
	@Autowired
	private LibraryDAO bookDAO;
	
	@GetMapping("books")
	public List<Book> getBooks() {
		bookDAO.getData();
		return new ArrayList<Book>(bookDAO.getBooks().values());
	};
	
	@GetMapping("authors")
	public List<Author> getAuthors() {
		bookDAO.getData();
		return new ArrayList<Author>(bookDAO.getAuthors().values());
	};
	
	@GetMapping("names")
	public Names getNames() {
		
		// список імен і список прізвищ для автозаповнення форм
		return new Names(bookDAO.getFirstNames(), bookDAO.getLastNames());
	}
	
	@GetMapping("book/{id}")
	public Book getBook(@PathVariable("id") Integer id) {
		return bookDAO.getBooks().get(id);
	}
	
	@GetMapping("person/{id}")
	public Person getPerson(@PathVariable("id") Integer id) {
		return new Person(bookDAO.getAuthors().get(id));
	}
	
	@PostMapping
	public void insert(@RequestBody Book book) {
		int bookId = bookDAO.insertBook(book.getTitle(), book.getGenre(), book.getYear());
		for (Person person:book.getPersons()) {
			bookDAO.insertAuthor(person.getFirstName(), person.getLastName(), bookId);
		}
	}

	@PutMapping("book/{id}")
	void updateBook(@PathVariable("id") Integer id, @RequestBody Book book) {
		
		// оновлення даних про книгу і відв'язання від неї всіх авторів
		bookDAO.updateBook(id, book.getTitle(), book.getGenre(), book.getYear());
		
		// прив'язка нових (чи заново старих) авторів
		for (Person person:book.getPersons()) {
			bookDAO.insertAuthor(person.getFirstName(), person.getLastName(), id);
		}
		
		// видалення авторів, у яких в результаті не залишилося книг
		bookDAO.deleteUnusedAuthors();
	}
	
	@PutMapping("person/{id}")
	void updateAuthor(@PathVariable("id") Integer id, @RequestBody Person person) {
		bookDAO.updateAuthor(id, person.getFirstName(), person.getLastName());
	};
	
	@DeleteMapping("book/{id}")
	void deleteBook(@PathVariable("id") Integer id) {
		bookDAO.deleteBook(id);
	};
	
	@DeleteMapping("author/{id}")
	void deleteAuthor(@PathVariable("id") Integer id) {
		bookDAO.deleteAuthor(id);
	};
}
