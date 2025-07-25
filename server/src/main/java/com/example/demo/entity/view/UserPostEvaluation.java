package com.example.demo.entity.view;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserPostEvaluation {
	
	@Id
	private Integer id;				// user_postsのid
	private Integer eventId;		// user_postsのevent_id
	private Integer userId;			// user_postsのuser_id
	private String content;			// user_postsのcontent
	private Integer count;			// user_postsのcount
	private Integer evaluationId;	// evaluationsのid
}
