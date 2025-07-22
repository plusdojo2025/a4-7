package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.UserPost;
import com.example.demo.repository.UserPostsRepository;

@RestController
public class UserPostController {

	@Autowired
	UserPostsRepository repository;
	
	// 選択中イベントの投稿全取得
	@PostMapping("/api/postList/")
	public List<UserPost> getPosts(@RequestBody UserPost userPost) {
		Integer eventId = userPost.getEventId();
		List<UserPost> postList = repository.findByEventIdOrderByIdDesc(eventId);
		return postList;
	}
}
