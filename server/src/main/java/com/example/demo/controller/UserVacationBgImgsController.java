package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.UserVacationBackgrounds;
import com.example.demo.repository.UserVacationBgImgsRepository;

@RestController
@RequestMapping("/uvbgs")
public class UserVacationBgImgsController {
	@Autowired
	UserVacationBgImgsRepository repo;
	
	@GetMapping("/{vacationsId}")
	public List<UserVacationBackgrounds> getByVacationsId(@PathVariable Integer vacationsId){
		return repo.findByVacationsIdOrderByContentOrderAsc(vacationsId);
	}
	
	@PostMapping
	public UserVacationBackgrounds insertUvbgs(@RequestBody UserVacationBackgrounds uvbgs) {
		repo.save(uvbgs);
		return uvbgs;
	}
	
}
