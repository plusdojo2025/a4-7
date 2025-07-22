package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.entity.EventTheme;

public interface EventThemesRepository extends JpaRepository<EventTheme, Integer> {
	
	// 過去から現在開催中までのイベントタイトルを取得するメソッド
	@Query(value = "select * from event_themes "
			+ "where end_date <= curdate() "
			+ "or curdate() between start_date and end_date "
			+ "order by start_date",
			nativeQuery = true)
	List<EventTheme> getEventList();
}
