package com.example.demo.repository.view;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entity.view.UserPostEvaluation;

public interface UserPostEvaluationsRepository extends JpaRepository<UserPostEvaluation, Integer> {

	// 開催中イベントの全投稿とその投稿にいいねしたかを取得　投稿は新しいもの順
	@Query(value = "select user_posts.id, user_posts.event_id, user_posts.user_id, content, count, evaluations.id as evaluation_id "
			+ "from user_posts "
			+ "left join evaluations "
			+ "on user_posts.id = evaluations.post_id and evaluations.user_id = :user_id "
			+ "where event_id = :event_id "
			+ "order by user_posts.id desc",
			nativeQuery = true)
	List<UserPostEvaluation> getPostWithEvaluation(@Param("event_id")Integer eventId, @Param("user_id")Integer userId);
	
	// 過去イベントの全投稿とその投稿にいいねしたかを取得　投稿はいいね数順
	@Query(value = "select user_posts.id, user_posts.event_id, user_posts.user_id, content, count, evaluations.id as evaluation_id "
			+ "from user_posts "
			+ "left join evaluations "
			+ "on user_posts.id = evaluations.post_id and evaluations.user_id = :user_id "
			+ "where event_id = :event_id "
			+ "order by count desc",
			nativeQuery = true)
	List<UserPostEvaluation> getPastPostWithEvaluation(@Param("event_id")Integer eventId, @Param("user_id")Integer userId);
	
	// いいねの更新かけた投稿といいねしたか取得するメソッド
	@Query(value = "select user_posts.id, user_posts.event_id, user_posts.user_id, content, count, evaluations.id as evaluation_id "
			+ "from user_posts "
			+ "left join evaluations "
			+ "on user_posts.id = evaluations.post_id and evaluations.user_id = :user_id "
			+ "where user_posts.id = :post_id",
			nativeQuery = true)
	UserPostEvaluation getUpdatePostWithEvaluation(@Param("post_id") Integer postId, @Param("user_id")Integer userId);
}
