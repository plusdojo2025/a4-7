package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.HomeworkSchedules;
import com.example.demo.repository.HomeworkSchedulesRepository;

@RestController
public class HomeworkSchedulesController {
	@Autowired
	private HomeworkSchedulesRepository repo;
	
	@GetMapping("/homeworkSchedules/")
	private List<HomeworkSchedules> get(Integer userId, Integer vacationId){
		return repo.findByUserIdAndVacationId(userId, vacationId);
	}
	
	@PostMapping("/homeworkSchedules/mod/")
	public HomeworkSchedules mod(@RequestBody HomeworkSchedules homeworkSchedules) {
		repo.save(homeworkSchedules);
		return homeworkSchedules;
	}

}
