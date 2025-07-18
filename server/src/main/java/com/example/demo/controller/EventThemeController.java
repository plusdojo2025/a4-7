package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.EventTheme;
import com.example.demo.repository.EventThemesRepositoory;

@RestController
public class EventThemeController {
	
	@Autowired
	private EventThemesRepositoory repositoory;

	// イベント情報全取得
	@GetMapping("/api/eventList/")
	public List<EventTheme> getEvents(Model model) {
		List<EventTheme> eventList = repositoory.getEventList();
		return eventList;
	}
}
