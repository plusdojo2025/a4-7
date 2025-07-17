package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Columns;
import com.example.demo.entity.PrivateSchedules;

public interface ColumnsRepository extends JpaRepository<Columns, Integer> {
	List<PrivateSchedules> findByUserIdAndVacationId(Integer userId, int vacationId);
}
