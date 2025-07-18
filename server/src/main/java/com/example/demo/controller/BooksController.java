package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Books;
import com.example.demo.repository.BooksRepository;

@RestController
public class BooksController {
	@Autowired
	private BooksRepository repository;
	
	@GetMapping("/book/grade1/")
	private List<Books> getG1(){
		return repository.findByGrade(1);
	}
	
	@GetMapping("/book/grade2/")
	private List<Books> getG2(){
		return repository.findByGrade(2);
	}
	
	@GetMapping("/book/grade3/")
	private List<Books> getG3(){
		return repository.findByGrade(3);
	}
	
	@GetMapping("/book/grade4/")
	private List<Books> getG4(){
		return repository.findByGrade(4);
	}
	
	@GetMapping("/book/grade5/")
	private List<Books> getG5(){
		return repository.findByGrade(5);
	}
	
	@GetMapping("/book/grade6/")
	private List<Books> getG6(){
		return repository.findByGrade(6);
	}
}
