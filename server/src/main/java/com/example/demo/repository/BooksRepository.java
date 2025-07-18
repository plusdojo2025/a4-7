package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Books;

public interface BooksRepository extends JpaRepository<Books, Integer> {
	List<Books> findByGrade(int grade);
}
