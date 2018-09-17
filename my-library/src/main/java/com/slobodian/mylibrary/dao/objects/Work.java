package com.slobodian.mylibrary.dao.objects;

public class Work {
	
	private int id;
	private String title;

	public Work() { }

	public Work(Book book) {
		this.id = book.getId();
		this.title = book.getTitle();
	}

	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}
	
	public void setTitle(String title) {
		this.title = title;
	}

}
