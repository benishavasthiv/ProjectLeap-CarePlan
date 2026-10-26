package com.careplan.careplan.repository;

import com.careplan.careplan.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    List<Medicine> findByPatientId(Long patientId);
}