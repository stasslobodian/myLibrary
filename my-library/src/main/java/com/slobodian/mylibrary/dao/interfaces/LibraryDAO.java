package com.slobodian.mylibrary.dao.interfaces;

import java.util.LinkedHashMap;
import java.util.List;

import com.slobodian.mylibrary.dao.objects.Author;
import com.slobodian.mylibrary.dao.objects.Book;

public interface LibraryDAO {
	
	public void getData();

	void insertAuthor(String firstName, String lastName, int bookId);
	
	int insertBook(String title, String genre, int year);

	LinkedHashMap<Integer, Author> getAuthors();

	LinkedHashMap<Integer, Book> getBooks();

	List<String> getFirstNames();

	List<String> getLastNames();

	void updateAuthor(int id, String firstName, String lastName);

	void updateBook(int id, String title, String genre, int year);

	void deleteAuthor(int id);

	void deleteBook(int id);

	void deleteUnusedAuthors();
	
}
