package com.slobodian.mylibrary.dao.objects;

import java.util.ArrayList;
import java.util.List;

public class Book extends Work {
	
	private List<Person> persons;
	private String genre;
	private int year;
	
	public Book() {
		super();
		persons = new ArrayList<Person>(1);
	}

	public void addAuthor(Author author) {
		persons.add(new Person(author));
	}

	public String getGenre() {
		return genre;
	}
	public void setGenre(String genre) {
		this.genre = genre;
	}
	public int getYear() {
		return year;
	}
	public void setYear(int year) {
		this.year = year;
	}

	public List<Person> getPersons() {
		return persons;
	}
}
