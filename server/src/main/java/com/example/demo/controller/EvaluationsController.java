package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Evaluation;
import com.example.demo.entity.view.UserPostEvaluation;
import com.example.demo.repository.EvaluationsRepository;
import com.example.demo.repository.UserPostsRepository;
import com.example.demo.repository.view.UserPostEvaluationsRepository;

@RestController
public class EvaluationsController {

	@Autowired
	private EvaluationsRepository eRepository;
	@Autowired
	private UserPostsRepository pRepository;
	@Autowired
	UserPostEvaluationsRepository peRepository;
	
	@PostMapping("/api/changeEvaluation/")
	private UserPostEvaluation changEvaluation(@RequestBody Evaluation evaluation) {
		Integer postId = evaluation.getPostId();
		Integer userId = evaluation.getUserId();
		
		// いいね済みか
		if (eRepository.existsByPostIdAndUserId(postId, userId)) {	// いいね済み
			// いいね解除
			if (eRepository.deleteByPostIdAndUserId(postId, userId) != 1) {
				return null;
			}
			
			// いいね数-1
			if (pRepository.decrementCount(postId) != 1) {
				return null;
			}
		} else {													// いいねしてない
			// いいね登録
			eRepository.save(evaluation);
			
			// いいね数+1
			if (pRepository.incrementCount(postId) != 1) {
				return null;
			}
		}
		
		// 正常終了したら更新した投稿といいねしたか取得
		UserPostEvaluation userPostEvaluation = peRepository.getUpdatePostWithEvaluation(postId, userId);
		return userPostEvaluation;
	}
}
