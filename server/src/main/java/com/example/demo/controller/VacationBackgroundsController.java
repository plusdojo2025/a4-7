package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.VacationBackgrounds;
import com.example.demo.repository.VacationBackgroundsRepository;

@RestController
@RequestMapping("/vbgs")
public class VacationBackgroundsController {
	@Autowired
	VacationBackgroundsRepository repo;
	
	@GetMapping("/{VacationsSwitch}")
	public List<VacationBackgrounds> getByVacationsId(@PathVariable Integer VacationsSwitch){
		return repo.findByVacationSwitch(VacationsSwitch);
	}
	
	@PostMapping
	public VacationBackgrounds insertUvbgs(@RequestBody VacationBackgrounds vbgs) {
		repo.save(vbgs);
		return vbgs;
	}
}
