package com.careplan.careplan.controller;

import com.careplan.careplan.entity.Medicine;
import com.careplan.careplan.service.MedicineService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    private final MedicineService medicineService;

    public MedicineController(MedicineService medicineService) {
        this.medicineService = medicineService;
    }

    // CREATE MEDICINE
    @PostMapping
    public ResponseEntity<Medicine> createMedicine(
            @RequestBody Medicine medicine) {

        Medicine savedMedicine =
                medicineService.createMedicine(medicine);

        return new ResponseEntity<>(
                savedMedicine,
                HttpStatus.CREATED
        );
    }

    // GET ALL MEDICINES
    @GetMapping
    public ResponseEntity<List<Medicine>> getAllMedicines() {

        List<Medicine> medicines =
                medicineService.getAllMedicines();

        return ResponseEntity.ok(medicines);
    }

    // GET MEDICINE BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Medicine> getMedicineById(
            @PathVariable Long id) {

        Optional<Medicine> medicine =
                medicineService.getMedicineById(id);

        if (medicine.isPresent()) {
            return ResponseEntity.ok(medicine.get());
        }

        return ResponseEntity.notFound().build();
    }

    // UPDATE MEDICINE
    @PutMapping("/{id}")
    public ResponseEntity<Medicine> updateMedicine(
            @PathVariable Long id,
            @RequestBody Medicine medicine) {

        Medicine updatedMedicine =
                medicineService.updateMedicine(id, medicine);

        if (updatedMedicine == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedMedicine);
    }

    // DELETE MEDICINE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicine(
            @PathVariable Long id) {

        +
        boolean deleted =
                medicineService.deleteMedicine(id);

        if (deleted) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }
}