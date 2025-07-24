package com.example.demo.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Trivias;
import com.example.demo.repository.TriviasRepository;

@RestController
@RequestMapping("/api/trivias")
public class TriviasController {
	@Autowired
	private TriviasRepository repo;
	
	@GetMapping("/{date}")
	public Trivias get(@PathVariable LocalDate date) {
		return repo.findFirstByDate(date);
	}
	@GetMapping("")
	public Trivias get() {
		return repo.findById(1).get();
	}

}
