package com.careplan.careplan.service;

import com.careplan.careplan.entity.Medicine;
import com.careplan.careplan.repository.MedicineRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicineService {

    private final MedicineRepository medicineRepository;

    public MedicineService(MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;
    }

    // CREATE MEDICINE
    public Medicine createMedicine(Medicine medicine) {
        return medicineRepository.save(medicine);
    }

    // GET ALL MEDICINES
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    // GET MEDICINE BY ID
    public Optional<Medicine> getMedicineById(Long id) {
        return medicineRepository.findById(id);
    }

    // UPDATE MEDICINE
    public Medicine updateMedicine(Long id, Medicine medicine) {

        Optional<Medicine> existingMedicine =
                medicineRepository.findById(id);

        if (existingMedicine.isPresent()) {

            Medicine existing = existingMedicine.get();

            existing.setMedicineName(medicine.getMedicineName());
            existing.setDosage(medicine.getDosage());
            existing.setFrequency(medicine.getFrequency());
            existing.setTiming(medicine.getTiming());

            if (medicine.getPatient() != null) {
                existing.setPatient(medicine.getPatient());
            }

            return medicineRepository.save(existing);
        }

        return null;
    }

    // DELETE MEDICINE
    public boolean deleteMedicine(Long id) {

        if (medicineRepository.existsById(id)) {
            medicineRepository.deleteById(id);
            return true;
        }

        return false;
    }
}