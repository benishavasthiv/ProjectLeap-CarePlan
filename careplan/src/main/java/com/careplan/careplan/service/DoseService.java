package com.careplan.careplan.service;

import com.careplan.careplan.entity.Dose;
import com.careplan.careplan.entity.Medicine;
import com.careplan.careplan.entity.Patient;
import com.careplan.careplan.repository.DoseRepository;
import com.careplan.careplan.repository.MedicineRepository;
import com.careplan.careplan.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class DoseService {

    private final DoseRepository doseRepository;
    private final MedicineRepository medicineRepository;
    private final PatientRepository patientRepository;

    public DoseService(
            DoseRepository doseRepository,
            MedicineRepository medicineRepository,
            PatientRepository patientRepository) {

        this.doseRepository = doseRepository;
        this.medicineRepository = medicineRepository;
        this.patientRepository = patientRepository;
    }


    // =====================================================
    // FEATURE 2
    // GENERATE TODAY'S EXPECTED DOSES
    // =====================================================

    public List<Dose> generateTodayDoses(Long patientId) {

        Patient patient =
                patientRepository.findById(patientId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient not found"
                                )
                        );

        LocalDate today =
                LocalDate.now();

        List<Dose> existingDoses =
                doseRepository.findByPatientIdAndDoseDate(
                        patientId,
                        today
                );

        // If doses already exist for today,
        // return them instead of creating duplicates.
        if (!existingDoses.isEmpty()) {
            return existingDoses;
        }

        List<Medicine> medicines =
                medicineRepository.findByPatientId(
                        patientId
                );

        List<Dose> doses =
                new ArrayList<>();


        for (Medicine medicine : medicines) {

            String frequency =
                    medicine.getFrequency();

            String timing =
                    medicine.getTiming();


            if (
                    frequency == null ||
                            timing == null
            ) {
                continue;
            }


            String frequencyLower =
                    frequency.toLowerCase();

            String timingLower =
                    timing.toLowerCase();


            boolean timingFound =
                    false;


            // -------------------------
            // MORNING
            // -------------------------

            if (timingLower.contains("morning")) {

                doses.add(
                        createDose(
                                patient,
                                medicine,
                                today,
                                LocalTime.of(8, 0)
                        )
                );

                timingFound = true;
            }


            // -------------------------
            // AFTERNOON
            // -------------------------

            if (timingLower.contains("afternoon")) {

                doses.add(
                        createDose(
                                patient,
                                medicine,
                                today,
                                LocalTime.of(13, 0)
                        )
                );

                timingFound = true;
            }


            // -------------------------
            // EVENING
            // -------------------------

            if (timingLower.contains("evening")) {

                doses.add(
                        createDose(
                                patient,
                                medicine,
                                today,
                                LocalTime.of(18, 0)
                        )
                );

                timingFound = true;
            }


            // -------------------------
            // NIGHT
            // -------------------------

            if (timingLower.contains("night")) {

                doses.add(
                        createDose(
                                patient,
                                medicine,
                                today,
                                LocalTime.of(20, 0)
                        )
                );

                timingFound = true;
            }


            // =================================================
            // FALLBACK BASED ON FREQUENCY
            // =================================================

            if (!timingFound) {

                // ONCE DAILY
                if (frequencyLower.contains("once")) {

                    doses.add(
                            createDose(
                                    patient,
                                    medicine,
                                    today,
                                    LocalTime.of(9, 0)
                            )
                    );
                }


                // TWICE DAILY
                else if (
                        frequencyLower.contains("twice")
                ) {

                    doses.add(
                            createDose(
                                    patient,
                                    medicine,
                                    today,
                                    LocalTime.of(9, 0)
                            )
                    );

                    doses.add(
                            createDose(
                                    patient,
                                    medicine,
                                    today,
                                    LocalTime.of(20, 0)
                            )
                    );
                }


                // THREE TIMES DAILY
                else if (
                        frequencyLower.contains("three")
                ) {

                    doses.add(
                            createDose(
                                    patient,
                                    medicine,
                                    today,
                                    LocalTime.of(8, 0)
                            )
                    );

                    doses.add(
                            createDose(
                                    patient,
                                    medicine,
                                    today,
                                    LocalTime.of(14, 0)
                            )
                    );

                    doses.add(
                            createDose(
                                    patient,
                                    medicine,
                                    today,
                                    LocalTime.of(20, 0)
                            )
                    );
                }
            }
        }


        return doseRepository.saveAll(
                doses
        );
    }


    // =====================================================
    // GET TODAY'S DOSES
    // =====================================================

    public List<Dose> getTodayDoses(
            Long patientId) {

        LocalDate today =
                LocalDate.now();

        return doseRepository
                .findByPatientIdAndDoseDate(
                        patientId,
                        today
                );
    }


    // =====================================================
    // FEATURE 3
    // UPDATE DOSE STATUS
    // TAKEN / MISSED
    // =====================================================

    public Dose updateDoseStatus(
            Long doseId,
            String status) {

        Dose dose =
                doseRepository.findById(
                                doseId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Dose not found"
                                )
                        );


        if (
                !status.equalsIgnoreCase("TAKEN") &&
                        !status.equalsIgnoreCase("MISSED")
        ) {

            throw new IllegalArgumentException(
                    "Status must be TAKEN or MISSED"
            );
        }


        dose.setStatus(
                status.toUpperCase()
        );


        return doseRepository.save(
                dose
        );
    }


    // =====================================================
    // FEATURE 4
    // MISSED DOSE HISTORY
    // =====================================================

    public List<Dose> getMissedDoseHistory(
            Long patientId,
            LocalDate fromDate,
            LocalDate toDate) {

        return doseRepository
                .findByPatientIdAndStatusAndDoseDateBetween(
                        patientId,
                        "MISSED",
                        fromDate,
                        toDate
                );
    }


    // =====================================================
    // CREATE DOSE
    // =====================================================

    private Dose createDose(
            Patient patient,
            Medicine medicine,
            LocalDate date,
            LocalTime time) {

        Dose dose =
                new Dose();


        dose.setPatient(
                patient
        );

        dose.setMedicine(
                medicine
        );

        dose.setDoseDate(
                date
        );

        dose.setScheduledTime(
                time
        );

        dose.setStatus(
                "PENDING"
        );


        return dose;
    }
}