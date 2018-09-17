package com.slobodian.mylibrary.dao.objects;

import java.util.ArrayList;
import java.util.List;

public class Author extends Person {

	private ArrayList<Work> works;
	
	public Author() {
		super();
		works = new ArrayList<>(1);
	}
	
	public void addBook(Book book) {
		works.add(new Work(book));
	}

	public List<Work> getWorks() {
		return works;
	}

}
