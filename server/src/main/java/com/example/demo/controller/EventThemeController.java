package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.EventTheme;
import com.example.demo.repository.EventThemesRepository;

@RestController
public class EventThemeController {
	
	@Autowired
	private EventThemesRepository repository;

	// イベント情報全取得
	@GetMapping("/api/eventList/")
	public List<EventTheme> getEvents() {
		List<EventTheme> eventList = repository.getEventList();
		return eventList;
	}
}
