package com.example.demo.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data // getter・setterの自動設定
//@Table(name="private_schedules", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id","content_date"}) )
@Table(name="private_schedules")
public class PrivateSchedules {
	@Id	// プライマリーキー
	@GeneratedValue(strategy=GenerationType.IDENTITY) // オートインクリメント
	private Integer id;
	private Integer userId;
	private String content;
	private LocalDate contentDate;
	private Integer vacationId;
}
