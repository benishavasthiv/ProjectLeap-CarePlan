package com.careplan.careplan.repository;

import com.careplan.careplan.entity.Dose;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DoseRepository extends JpaRepository<Dose, Long> {

    // Get all doses for a patient on a particular date
    List<Dose> findByPatientIdAndDoseDate(
            Long patientId,
            LocalDate doseDate
    );

    // Get missed doses for a patient between two dates
    List<Dose> findByPatientIdAndStatusAndDoseDateBetween(
            Long patientId,
            String status,
            LocalDate fromDate,
            LocalDate toDate
    );
}