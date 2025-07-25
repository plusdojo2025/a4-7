package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.UserPost;
import com.example.demo.entity.view.UserPostEvaluation;
import com.example.demo.repository.UserPostsRepository;
import com.example.demo.repository.view.UserPostEvaluationsRepository;

@RestController
public class UserPostController {

	@Autowired
	UserPostsRepository repository;
	@Autowired
	UserPostEvaluationsRepository peRepository;
	
	// 開催中イベントの全投稿とログインユーザーがいいねしたかを取得
	@PostMapping("/api/postList/")
	public List<UserPostEvaluation> getPosts(@RequestBody UserPost userPost) {
		Integer eventId = userPost.getEventId();
		Integer userId = userPost.getUserId();
		List<UserPostEvaluation> peList = peRepository.getPostWithEvaluation(eventId, userId);
		return peList;
	}
	
	// 過去イベントの全投稿とログインユーザーがいいねしたかを取得
	@PostMapping("/api/pastPostList/")
	public List<UserPostEvaluation> getPastPosts(@RequestBody UserPost userPost) {
		Integer eventId = userPost.getEventId();
		Integer userId = userPost.getUserId();
		List<UserPostEvaluation> peList = peRepository.getPastPostWithEvaluation(eventId, userId);
		return peList;
	}
	
	// 選択中イベントのログインユーザーの投稿取得
	@PostMapping("/api/myPost/")
	public UserPost getMyPost(@RequestBody UserPost userPost) {
		Integer eventId = userPost.getEventId();
		Integer userId = userPost.getUserId();
		UserPost myPost = repository.findByEventIdAndUserId(eventId, userId);
		return myPost;
	}
	
	// 投稿登録
	@PostMapping("/api/post/")
	public UserPost addMyPost(@RequestBody UserPost userPost) {
		repository.save(userPost);
		return userPost;
	}
}
