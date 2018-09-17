package com.slobodian.mylibrary.dao.objects;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

public class Names {
	private Set<String> firstNames;
	private Set<String> lastNames;
	
	public Names(List<String> firstNames, List<String> lastNames) {
		setFirstNames(firstNames);
		setLastNames(lastNames);
	}

	public Set<String> getFirstNames() {
		return firstNames;
	}

	public void setFirstNames(List<String> firstNames) {
		this.firstNames = new LinkedHashSet<String>(firstNames);
	}

	public Set<String> getLastNames() {
		return lastNames;
	}

	public void setLastNames(List<String> lastNames) {
		this.lastNames = new LinkedHashSet<String>(lastNames);
	}
}
