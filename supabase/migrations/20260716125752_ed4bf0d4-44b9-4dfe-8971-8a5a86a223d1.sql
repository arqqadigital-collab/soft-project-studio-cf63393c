
-- Seed image URLs, icon names, and logos into existing card items so the
-- dashboard editor displays them (the live pages already resolve these from
-- code-side imports; this only adds them to the DB rows for the editor UI).

DO $$
DECLARE
  bb_id uuid;
  med_id uuid;
BEGIN
  SELECT id INTO bb_id FROM pages WHERE slug = 'blood-bank-and-donor-management';
  SELECT id INTO med_id FROM pages WHERE slug = 'healthcare-medication-dosage';

  -- ================= BLOOD BANK =================
  -- The Problem: add images
  UPDATE page_sections SET data = jsonb_set(data, '{items}', '[
    {"title":"Mislabeled Units","image":"/__l5e/assets-v1/3fe5efa5-9935-42a6-986b-eb2faa326be6/mislabeled.jpg","description":"A mislabeled unit reaching the wrong patient — a single clerical error with life-threatening consequences and no easy path to recovery."},
    {"title":"Expired Components","image":"/__l5e/assets-v1/7acf910e-2e46-4d9f-9cb9-43cb7acd58d6/expired.jpg","description":"Expired components missed because inventory tracking was manual, wasting precious donations and exposing patients to risk."},
    {"title":"Paper-Based Donor History","image":"/__l5e/assets-v1/9f46fc5c-7ee4-4ebb-add3-6dedbaf1b394/paper.jpg","description":"A donor turned away — or worse, cleared in error — because eligibility history was stored on paper and never reconciled."},
    {"title":"Unstructured Reaction Reporting","image":"/__l5e/assets-v1/b1b293db-3abe-4efe-b7ed-2f355f80623d/reaction.jpg","description":"A transfusion reaction with no structured reporting pathway, no investigation workflow, and no data trail for hemovigilance."},
    {"title":"Audit Gaps","image":"/__l5e/assets-v1/08214490-4bfd-46a4-9645-a7c58d4747ad/audit.jpg","description":"A regulatory audit revealing gaps in chain-of-custody documentation — exactly the gaps that erode trust and put licensure at risk."}
  ]'::jsonb)
  WHERE page_id = bb_id AND data->>'section_name' = 'The Problem';

  -- Patient Journey: add images (icons already present)
  UPDATE page_sections SET data = jsonb_set(data, '{items}', '[
    {"icon":"UserCheck","title":"Donor Arrives","image":"/__l5e/assets-v1/bb1d4168-dc3f-4d51-9d4f-a06abdc92eaa/donor-arrives-new.jpg","description":"The system retrieves the donor''s full history, runs automated eligibility checks, and either clears them for collection or flags the appropriate deferral reason — all before a needle is placed."},
    {"icon":"Droplets","title":"Unit Collected & Processed","image":"/__l5e/assets-v1/d4ab6bd9-fa27-4621-8407-a2db2f68d76d/collection.jpg","description":"Collection details are recorded in real time. Components are processed and entered into inventory with full traceability. Testing requests are sent automatically to the laboratory."},
    {"icon":"FlaskConical","title":"Testing & Quarantine","image":"/__l5e/assets-v1/416ccecf-034c-4bdb-9819-65e43a67b58c/testing.jpg","description":"Units remain in quarantine until all required test results are received and validated. Reactive or incomplete results trigger automatic holds that cannot be overridden without authorization."},
    {"icon":"TestTube2","title":"Crossmatch & Issue","image":"/__l5e/assets-v1/216a9fbe-7d2c-4510-bb65-e3aaf20e3d49/crossmatch.jpg","description":"A transfusion request arrives from the ward. The system performs compatibility checks, confirms crossmatch results, and issues the unit with a complete handover record."},
    {"icon":"HeartPulse","title":"Transfusion & Follow-up","image":"/__l5e/assets-v1/b3c61d7b-8899-4c0d-9742-6a1896244222/transfusion.jpg","description":"Transfusion is documented at the bedside. Any adverse events are reported through the integrated hemovigilance pathway. The complete unit lifecycle is archived for audit and regulatory review."}
  ]'::jsonb)
  WHERE page_id = bb_id AND data->>'section_name' = 'Patient Journey';

  -- Integrations: add logos (keep existing names)
  UPDATE page_sections SET data = jsonb_set(data, '{items}', '[
    {"name":"AABB Accredited","logo":"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/AABB_logo.svg/200px-AABB_logo.svg.png"},
    {"name":"FDA 21 CFR Part 11 Compliance","logo":"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Food_and_Drug_Administration_logo.svg/200px-Food_and_Drug_Administration_logo.svg.png"},
    {"name":"ICCBBA ISBT 128","logo":""},
    {"name":"ISO 15189 Accreditation","logo":""}
  ]'::jsonb)
  WHERE page_id = bb_id AND data->>'section_name' = 'Integrations';

  -- ================= MEDICATION =================
  -- The Problem: add images
  UPDATE page_sections SET data = jsonb_set(data, '{items}', '[
    {"title":"Prescribing Without Allergy Awareness","image":"/__l5e/assets-v1/a0cc3c17-9c79-4d0a-8bc8-2c8a46176c62/allergy.jpg","description":"A physician prescribes a drug without knowing the patient is allergic. Cross-reactive drug families are missed, and the patient is exposed to a preventable adverse reaction."},
    {"title":"Outdated Paper MARs","image":"/__l5e/assets-v1/32732704-7f18-4718-b735-9be530fc8778/paper-mar.jpg","description":"A nurse administers the wrong dose because the paper MAR was updated after she printed it. What she holds in her hand is already out of date — and the patient pays the price."},
    {"title":"Missed Drug Interactions","image":"/__l5e/assets-v1/e85e95f9-febf-434f-8a01-8a77d8d35459/interaction.jpg","description":"A pharmacist misses a dangerous interaction because two prescribers are using separate systems. The warning never fires, and a harmful combination reaches the patient."},
    {"title":"Unaccounted Controlled Substances","image":"/__l5e/assets-v1/3886a5e7-82e8-408d-9261-a509136e33d4/controlled.jpg","description":"A controlled substance goes unaccounted for because reconciliation is done manually at end of shift. Paper logs are incomplete, and diversion goes undetected."},
    {"title":"Weight-Based Dosing Errors","image":"/__l5e/assets-v1/8b2b18e9-9683-4055-8e62-1bd5218db4b2/pediatric-dose.jpg","description":"A child receives an adult dose because weight-based calculation was done on a pocket calculator. A decimal place error, a unit conversion mistake — both can be fatal in pediatric care."}
  ]'::jsonb)
  WHERE page_id = med_id AND data->>'section_name' = 'The Problem';

  -- Patient Journey: add images
  UPDATE page_sections SET data = jsonb_set(data, '{items}', '[
    {"icon":"FileText","title":"Prescribe","image":"/__l5e/assets-v1/06585173-9e5c-4096-aebe-e1937111d4bd/prescribe.jpg","description":"The physician opens the patient record and enters a medication order. Clinical decision support checks for allergies, interactions, and dose appropriateness in real time. The order is placed only when it is safe to proceed."},
    {"icon":"ClipboardCheck","title":"Verify","image":"/__l5e/assets-v1/3dfa8829-5584-409d-8f2f-bb9c177962c7/verify.jpg","description":"The prescription arrives instantly in the pharmacy queue. The pharmacist reviews the order in clinical context, approves it, and prepares the medication. Dispensing labels are printed automatically with all required identifiers."},
    {"icon":"Boxes","title":"Dispense","image":"/__l5e/assets-v1/ea78c2bd-1126-4ec7-aae4-2095bb68aefb/dispense.jpg","description":"The medication is dispensed from the correct location — central pharmacy, automated cabinet, or ward stock — with every movement logged against the patient order. Controlled substances require dual verification."},
    {"icon":"Syringe","title":"Administer","image":"/__l5e/assets-v1/d5e3cfb3-913d-42d9-ac4c-5bc052704611/administer.jpg","description":"The nurse scans the patient wristband and the medication barcode at the bedside. The system confirms a match against the live eMAR and gives a green light for administration. Any mismatch stops the process and triggers an alert."},
    {"icon":"FileCheck","title":"Document & Review","image":"/__l5e/assets-v1/d687d51e-7bfc-408b-86ac-ebbaf7823970/document.jpg","description":"Administration is recorded automatically. Missed doses, refusals, and partial doses are flagged for clinical review. Pharmacists and physicians see the complete medication administration history in real time."}
  ]'::jsonb)
  WHERE page_id = med_id AND data->>'section_name' = 'Patient Journey';
END $$;
