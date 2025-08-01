package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Columns;

public interface ColumnsRepository extends JpaRepository<Columns, Integer> {
	List<Columns> findByUserIdAndVacationIdOrderByPositionAsc(Integer userId, Integer vacationId);
}
