package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Evaluation;

public interface EvaluationsRepository extends JpaRepository<Evaluation, Integer> {

}
