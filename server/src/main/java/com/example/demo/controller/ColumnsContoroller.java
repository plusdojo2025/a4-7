package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Columns;
import com.example.demo.repository.ColumnsRepository;

@RestController
public class ColumnsContoroller {
	@Autowired
	private ColumnsRepository repo;
	
	@GetMapping("/columns/")
	private List<Columns> get(Integer userId, Integer vacationId) {
		return repo.findByUserIdAndVacationIdOrderByPositionAsc(userId, vacationId);
	}
	
	@PostMapping("/columns/save")
	private Columns save(@RequestBody Columns columns) {
		Columns savedColumns = repo.save(columns);
		return savedColumns;
	}
}
