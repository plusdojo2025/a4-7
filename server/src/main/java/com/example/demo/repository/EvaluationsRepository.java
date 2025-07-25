package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.Evaluation;

public interface EvaluationsRepository extends JpaRepository<Evaluation, Integer> {

	// いいね情報が登録済みか
	boolean existsByPostIdAndUserId(Integer postId, Integer userId);
	
	// いいね削除
	@Transactional
	int deleteByPostIdAndUserId(Integer postId, Integer userId);
}
