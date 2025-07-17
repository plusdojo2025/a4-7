package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.PrivateSchedules;
import com.example.demo.repository.PrivateSchedulesRepository;

@RestController
public class PrivateSchedulesController {
	@Autowired
	private PrivateSchedulesRepository psRep;
	
	@GetMapping("/privateSchedules/")
	public List<PrivateSchedules> index(Integer userId, Integer vacationId, Model model) {
		return psRep.findByUserIdAndVacationId(userId, vacationId);
	}

}
