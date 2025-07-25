package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.UserPost;

public interface UserPostsRepository extends JpaRepository<UserPost, Integer> {
	
	// 選択中イベントのログインユーザーの投稿を取得するメソッド
	UserPost findByEventIdAndUserId(Integer eventId, Integer userId);
	
	// いいね数+1
	@Modifying
    @Transactional
	@Query(value = "update user_posts set count = count + 1 "
			+ "where id = :post_id",
			nativeQuery = true)
	int incrementCount(@Param("post_id") Integer postId);
	
	// いいね数-1
	@Modifying
    @Transactional
	@Query(value = "update user_posts set count = count - 1 "
			+ "where id = :post_id",
			nativeQuery = true)
	int decrementCount(@Param("post_id") Integer postId);
}
