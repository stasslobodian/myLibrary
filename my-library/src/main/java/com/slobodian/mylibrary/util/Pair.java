package com.slobodian.mylibrary.util;

public class Pair {
	private int authorId, bookId;
	
	public Pair(int authorId, int bookId) {
		this.authorId = authorId;
		this.bookId = bookId;
	}

	public int getAuthorId() {
		return authorId;
	}
	
	public int getBookId() {
		return bookId;
	}
}
