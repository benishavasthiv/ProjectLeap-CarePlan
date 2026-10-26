package com.careplan.careplan.controller;

import com.careplan.careplan.entity.Dose;
import com.careplan.careplan.service.DoseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/doses")
public class DoseController {

    private final DoseService doseService;


    public DoseController(
            DoseService doseService) {

        this.doseService =
                doseService;
    }


    // =====================================================
    // FEATURE 2
    // GENERATE TODAY'S DOSES
    // =====================================================

    @PostMapping("/generate/today/{patientId}")
    public ResponseEntity<List<Dose>>
    generateTodayDoses(
            @PathVariable Long patientId) {

        return ResponseEntity.ok(
                doseService.generateTodayDoses(
                        patientId
                )
        );
    }


    // =====================================================
    // GET TODAY'S DOSES
    // =====================================================

    @GetMapping("/today/{patientId}")
    public ResponseEntity<List<Dose>>
    getTodayDoses(
            @PathVariable Long patientId) {

        return ResponseEntity.ok(
                doseService.getTodayDoses(
                        patientId
                )
        );
    }


    // =====================================================
    // FEATURE 3
    // MARK DOSE AS TAKEN OR MISSED
    // =====================================================

    @PutMapping("/{doseId}/status")
    public ResponseEntity<Dose>
    updateDoseStatus(
            @PathVariable Long doseId,
            @RequestParam String status) {

        return ResponseEntity.ok(
                doseService.updateDoseStatus(
                        doseId,
                        status
                )
        );
    }


    // =====================================================
    // FEATURE 4
    // MISSED DOSE HISTORY
    // =====================================================

    @GetMapping("/missed-history/{patientId}")
    public ResponseEntity<List<Dose>>
    getMissedDoseHistory(
            @PathVariable Long patientId,
            @RequestParam String fromDate,
            @RequestParam String toDate) {

        return ResponseEntity.ok(
                doseService.getMissedDoseHistory(
                        patientId,
                        LocalDate.parse(fromDate),
                        LocalDate.parse(toDate)
                )
        );
    }
}