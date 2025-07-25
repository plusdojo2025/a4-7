package com.example.demo.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Vacations;
import com.example.demo.repository.VacationsRepository;

@RestController
@RequestMapping("/api/vacations")
@CrossOrigin(origins = "http://localhost:3000") 
public class VacationsController {
    @Autowired
    private VacationsRepository vacationsRepository;
    
    // 全ての休暇情報を取得
    @GetMapping
    public ResponseEntity<List<Vacations>> getAllVacations() {
        try {
            List<Vacations> vacations = vacationsRepository.findAll();
            return new ResponseEntity<>(vacations, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // ユーザーIDで指定した休暇情報を取得
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Vacations>> getVacationsByUserId(@PathVariable("userId") Integer userId) {
        try {
            List<Vacations> vacations = vacationsRepository.findByUserIdOrderByStartDateDesc(userId);
            return new ResponseEntity<>(vacations, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
 // ユーザーIDで指定した休暇情報を取得
    @GetMapping("/{vacationId}")
    public Vacations getVacationsByVacationId(@PathVariable("vacationId") Integer vacationId) {
        return vacationsRepository.findById(vacationId).get();       
    }
    
    
    // 新しい休暇情報を作成
    @PostMapping
    public Vacations createVacation(@RequestBody Vacations vacation) {
        // IDを自動生成するためnullに設定
        vacation.setId(null);
        // データベースに保存
        Vacations savedVacation = vacationsRepository.save(vacation);
        return savedVacation;
    }
    
    // 休暇情報を更新
    @PostMapping("/mod/")
    public Vacations mode(@RequestBody Vacations vacation){
    	vacationsRepository.save(vacation);
    	return vacation;    	
    }
}