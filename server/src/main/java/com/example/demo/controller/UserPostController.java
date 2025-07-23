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
	
	// 選択中イベントのログインユーザーの投稿取得
	@PostMapping("/api/myPost/")
	public UserPost getMyPost(@RequestBody UserPost userPost) {
		Integer eventId = userPost.getEventId();
		Integer userId = userPost.getUserId();
		UserPost myPost = repository.findByEventIdAndUserId(eventId, userId);
		System.out.print(myPost);
		return myPost;
	}
	
	// 投稿登録
	@PostMapping("/api/post/")
	public UserPost addMyPost(@RequestBody UserPost userPost) {
		repository.save(userPost);
		System.out.print(userPost);
		return userPost;
	}
}
