package com.example.demo.entity;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data // getter・setterの自動設定
@Table(name="private_schedules", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id","content_date"}) )
public class PrivateSchedules {
	@Id	// プライマリーキー
	@GeneratedValue(strategy=GenerationType.IDENTITY) // オートインクリメント
	private Integer id;
	private Integer userId;
	private String content;
	private Date contentDate;
	private Integer vacationId;
}
