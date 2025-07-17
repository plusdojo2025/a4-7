package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.EventTheme;

public interface EventThemesRepositoory extends JpaRepository<EventTheme, Integer> {

}
