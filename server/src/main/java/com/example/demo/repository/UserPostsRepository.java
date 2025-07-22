package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.UserPost;

public interface UserPostsRepository extends JpaRepository<UserPost, Integer> {
	
	// 選択中イベントの全投稿を取得するメソッド
	List<UserPost> findByEventIdOrderByIdDesc(Integer eventId);
}
