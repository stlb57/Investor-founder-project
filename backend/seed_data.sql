INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('b572b5bc-b06d-4223-a313-6e8327981fbf', 'sarah.chen@apexventures.com', '$pbkdf2-sha256$29000$OWdsTalV6r13LqXU2lurtQ$WET/QEmEp2sndUIEqEJvLMYuLx/XU6eFaYL7xzlASUA', 'INVESTOR', NOW());

            INSERT INTO investors (id, user_id, name, firm_name, investor_type, investment_thesis, check_size_min, check_size_max, stage_focus, sector_focus, region_focus, created_at)
            VALUES (
                'd07c0d17-bf6d-40e1-870d-58229f3a2776',
                'b572b5bc-b06d-4223-a313-6e8327981fbf',
                'Sarah Chen',
                'Apex Ventures',
                'vc',
                'Backing diverse founders building scalable AI and Fintech solutions in Southeast Asia and North America.',
                500000,
                2000000,
                '["Seed", "Series A"]',
                '["Fintech", "AI", "Enterprise SaaS"]',
                '["Global", "North America", "Europe", "Asia"]',
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('09840952-804d-4469-b16a-5e99fea08bd1', 'marcus.thorne@gmail.com', '$pbkdf2-sha256$29000$oXRurfVe613LGeO8t9a6Fw$OcakJt2y/Fj/qPkmCHOw/MW01b50bfh.06ua30x7DJw', 'INVESTOR', NOW());

            INSERT INTO investors (id, user_id, name, firm_name, investor_type, investment_thesis, check_size_min, check_size_max, stage_focus, sector_focus, region_focus, created_at)
            VALUES (
                '159497ab-d2d5-442a-947c-32339fdf3ea7',
                '09840952-804d-4469-b16a-5e99fea08bd1',
                'Marcus Thorne',
                'BlackRock Capital (Angel Arm)',
                'angel',
                'Deep tech and hard science innovations that solve critical climate and energy challenges.',
                50000,
                250000,
                '["Pre-Seed", "Seed"]',
                '["Cleantech", "DeepTech", "Energy"]',
                '["Global", "North America", "Europe", "Asia"]',
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('e13281c4-f9fe-40bf-bd53-f2a7db1c26b7', 'elena@nextgen.com', '$pbkdf2-sha256$29000$GsN4j1FKqdWaU2ptTQmBUA$JL5Jk62/9Ke2lat11jm98h67sz0QXE39tWXX1A7ha80', 'INVESTOR', NOW());

            INSERT INTO investors (id, user_id, name, firm_name, investor_type, investment_thesis, check_size_min, check_size_max, stage_focus, sector_focus, region_focus, created_at)
            VALUES (
                'e28f20d8-f7eb-4199-af00-d6af1147026a',
                'e13281c4-f9fe-40bf-bd53-f2a7db1c26b7',
                'Elena Rodriguez',
                'NextGen Accelerators',
                'accelerator',
                'Accelerating early-stage healthtech and biotech startups with mentorship and global networks.',
                100000,
                150000,
                '["Pre-Seed"]',
                '["Healthtech", "Biotech"]',
                '["Global", "North America", "Europe", "Asia"]',
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('a3bb211f-3915-4e90-ba6f-308e73c91bbe', 'david@horizonpartners.vc', '$pbkdf2-sha256$29000$zXmPEcI45zyn9P4/B6D0vg$/QVQCbaG115OR1g532n0FiBqHaqypfgblhIIXZ.jr0Q', 'INVESTOR', NOW());

            INSERT INTO investors (id, user_id, name, firm_name, investor_type, investment_thesis, check_size_min, check_size_max, stage_focus, sector_focus, region_focus, created_at)
            VALUES (
                '853bac7d-7e16-4bc8-83a2-aa793f054e91',
                'a3bb211f-3915-4e90-ba6f-308e73c91bbe',
                'David Kim',
                'Horizon Partners',
                'vc',
                'Consumer internet and marketplace models with strong network effects.',
                1000000,
                5000000,
                '["Series A", "Series B"]',
                '["E-commerce", "Social", "Marketplace"]',
                '["Global", "North America", "Europe", "Asia"]',
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('531358af-bcb7-4625-8d01-8f55316ad2a2', 'amara@impactglobal.org', '$pbkdf2-sha256$29000$ofTeu5fyvheiVMoZw7j3ng$HukeLO1uj15FLfzS4paN63YV69jpvFTtsm1z8x63/1Y', 'INVESTOR', NOW());

            INSERT INTO investors (id, user_id, name, firm_name, investor_type, investment_thesis, check_size_min, check_size_max, stage_focus, sector_focus, region_focus, created_at)
            VALUES (
                '854892bd-e357-4fa4-8356-0d87e176a0da',
                '531358af-bcb7-4625-8d01-8f55316ad2a2',
                'Amara Diallo',
                'Impact Global',
                'family_office',
                'Long-term patient capital for businesses driving measurable social and environmental impact.',
                250000,
                1000000,
                '["Seed", "Series A"]',
                '["Edtech", "Agritech", "Cleantech"]',
                '["Global", "North America", "Europe", "Asia"]',
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('980ef724-f503-41c3-a52f-5722b7e9774d', 'founder@payflowglobal.com', '$pbkdf2-sha256$29000$HqP0fo8RAkBICcH4fw/B2A$lUcO4pTezpCzoEoKqgmrvDFQJdcuOUDXdjogQyx0brg', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                '6096275c-1e1c-4b4e-9023-b6ee2fa02d59',
                '980ef724-f503-41c3-a52f-5722b7e9774d',
                'PayFlow Global',
                'payflow-global',
                'Fintech',
                'Seamless cross-border payments and treasury management for SMEs in emerging markets.',
                'Seed',
                'Southeast Asia',
                'Jakarta',
                '11-20',
                '2023-12-29',
                'https://www.payflow-global.com',
                79,
                'MEDIUM',
                69,
                73,
                87,
                96,
                71,
                73,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                '5d53c680-cf3e-4cd5-b494-163f1822f870',
                '6096275c-1e1c-4b4e-9023-b6ee2fa02d59',
                79,
                69,
                73,
                87,
                96,
                71,
                5,
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('61c4cb89-faf6-496e-9704-4ec510bd276a', 'founder@vaultx.com', '$pbkdf2-sha256$29000$vzcGACDk3Pt/DwHAGOM8Rw$SwzPiREQxZeXRDFDpho39s4HR3h9zRzlZRrtizILRjA', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                '111bbba5-2519-4074-a8af-9f0f143aae8f',
                '61c4cb89-faf6-496e-9704-4ec510bd276a',
                'VaultX',
                'vaultx',
                'Fintech',
                'Decentralized custody infrastructure for institutional crypto assets.',
                'Series A',
                'North America',
                'New York',
                '21-50',
                '2024-06-30',
                'https://www.vaultx.com',
                78,
                'MEDIUM',
                79,
                56,
                91,
                88,
                77,
                94,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                'b7e59e2d-dfe2-4208-b6cc-e5277c67b2a0',
                '111bbba5-2519-4074-a8af-9f0f143aae8f',
                78,
                79,
                56,
                91,
                88,
                77,
                5,
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('cbd2dd6e-12a5-4cc3-838d-674c105f1df5', 'founder@flext.com', '$pbkdf2-sha256$29000$qFWKkVJKCeEcQ2gtBUDovQ$FRyFGDTZ1fLynXLxIg2eDSON44SjUI7O2przQLzAAz8', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                '2ab6310f-5564-4329-8168-db747a032031',
                'cbd2dd6e-12a5-4cc3-838d-674c105f1df5',
                'Flext',
                'flext',
                'Fintech',
                'API-first credit scoring engine for gig economy platforms.',
                'Pre-Seed',
                'Europe',
                'London',
                '3-5',
                '2024-08-03',
                'https://www.flext.com',
                67,
                'EARLY',
                76,
                44,
                93,
                68,
                55,
                95,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                '78fb0b23-0581-4e6a-80bf-653c37f52246',
                '2ab6310f-5564-4329-8168-db747a032031',
                67,
                76,
                44,
                93,
                68,
                55,
                5,
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('b3209c50-ab1e-4e4c-ab07-b9727d6486a2', 'founder@pensionpot.com', '$pbkdf2-sha256$29000$TOm9V0pJCSFE6P1fq/Veiw$dPoMNQJCB02lGaL.rU6qZoZjLvEpOgkrZayTqG87bnc', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                'cbbbc451-c4cf-4740-919c-3e469d86ffef',
                'b3209c50-ab1e-4e4c-ab07-b9727d6486a2',
                'PensionPot',
                'pensionpot',
                'Fintech',
                'Micro-pension savings app ensuring financial security for freelancers.',
                'Seed',
                'Europe',
                'Berlin',
                '6-10',
                '2024-01-31',
                'https://www.pensionpot.com',
                80,
                'MEDIUM',
                66,
                90,
                89,
                94,
                61,
                83,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                'd673d262-295d-4348-bb75-9720717ee62b',
                'cbbbc451-c4cf-4740-919c-3e469d86ffef',
                80,
                66,
                90,
                89,
                94,
                61,
                5,
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('7247c167-94c4-4d8f-b13c-8fa8d29e1f46', 'founder@neurolink.com', '$pbkdf2-sha256$29000$gpAyZkxpjbHWupfyvjfmnA$SPjGB3e1w3.eZ1ywtjxJAtfI09c375au/91/fweFqoY', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                '9aa14203-8e7d-40a9-b30f-b302e9f71418',
                '7247c167-94c4-4d8f-b13c-8fa8d29e1f46',
                'NeuroLink',
                'neurolink',
                'Healthtech',
                'Non-invasive BCI wearable for early detection of neurological disorders.',
                'Series A',
                'North America',
                'Boston',
                '11-20',
                '2025-02-18',
                'https://www.neurolink.com',
                64,
                'EARLY',
                90,
                62,
                54,
                64,
                54,
                77,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                '00512232-99f3-42a5-9db0-8217d728b4d2',
                '9aa14203-8e7d-40a9-b30f-b302e9f71418',
                64,
                90,
                62,
                54,
                64,
                54,
                5,
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('ebfb1b94-82fe-43b6-be48-599b0fcc7f66', 'founder@medimatchai.com', '$pbkdf2-sha256$29000$rnUOgbDW.r/3PqfUGmPsfQ$ch12fW.f/5J8c6d/TpRdhGMik7uj2crF/lBbZHob5no', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                'dbd33beb-420e-498a-8712-40507ff0dbaa',
                'ebfb1b94-82fe-43b6-be48-599b0fcc7f66',
                'MediMatch AI',
                'medimatch-ai',
                'Healthtech',
                'AI-driven platform connecting clinical trials with diverse patient populations.',
                'Seed',
                'North America',
                'San Francisco',
                '6-10',
                '2023-11-17',
                'https://www.medimatch-ai.com',
                68,
                'EARLY',
                62,
                57,
                79,
                66,
                79,
                79,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                'd86721bb-dc14-4672-94aa-2bae4314d2ab',
                'dbd33beb-420e-498a-8712-40507ff0dbaa',
                68,
                62,
                57,
                79,
                66,
                79,
                5,
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('9bba8c25-0a92-4047-afb5-bee35c235516', 'founder@curepath.com', '$pbkdf2-sha256$29000$EcLYWwshhJASwth7r5VyTg$q1JFRdsBVXobv9X.RDQYTK0c0FPASNNohoiSfQScxZk', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                '33dc365f-2a6a-484e-b5e0-172a59df78f9',
                '9bba8c25-0a92-4047-afb5-bee35c235516',
                'CurePath',
                'curepath',
                'Healthtech',
                'Personalized oncology treatment plans using genomic data analysis.',
                'Series A',
                'Europe',
                'Zurich',
                '21-50',
                '2024-05-03',
                'https://www.curepath.com',
                74,
                'MEDIUM',
                91,
                74,
                70,
                71,
                68,
                88,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                '1831d287-c478-4d0c-9ee2-7c4a98c2fcfd',
                '33dc365f-2a6a-484e-b5e0-172a59df78f9',
                74,
                91,
                74,
                70,
                71,
                68,
                5,
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('5dd964a0-621d-43af-88ed-ad7c92ad274a', 'founder@vitalsense.com', '$pbkdf2-sha256$29000$yHmvldIaQ2jN2TvHeE8pBQ$efwnrbI3utQQe180H0afGztgaYjdRCSmuLuZNm2D1nw', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                'a8693f76-07c8-4c13-98a4-c9c15246e2bc',
                '5dd964a0-621d-43af-88ed-ad7c92ad274a',
                'VitalSense',
                'vitalsense',
                'Healthtech',
                'Remote patient monitoring kit for post-op recovery at home.',
                'Pre-Seed',
                'North America',
                'Austin',
                '3-5',
                '2024-09-27',
                'https://www.vitalsense.com',
                72,
                'MEDIUM',
                95,
                44,
                76,
                73,
                75,
                87,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                '6c5e11df-4d47-4d81-8526-7c276f9fc4cd',
                'a8693f76-07c8-4c13-98a4-c9c15246e2bc',
                72,
                95,
                44,
                76,
                73,
                75,
                5,
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('280e34be-e330-4665-bfb6-d0b06349a0ae', 'founder@carbonloop.com', '$pbkdf2-sha256$29000$GWPM.b835lzrfS8FIERIqQ$Sw3Wo/o6zZv6rAMMNsGwfGSgV.GDyHHFnLJrlgXu5aM', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                '40fbc6b0-9eb9-4f1c-8abc-3894d11ae038',
                '280e34be-e330-4665-bfb6-d0b06349a0ae',
                'CarbonLoop',
                'carbonloop',
                'Cleantech',
                'Direct air capture technology turning CO2 into industrial grade feedstock.',
                'Series A',
                'Europe',
                'Stockholm',
                '21-50',
                '2025-04-12',
                'https://www.carbonloop.com',
                72,
                'MEDIUM',
                77,
                72,
                87,
                74,
                54,
                61,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                'a53a0a34-ece4-4c35-a881-cd675a288576',
                '40fbc6b0-9eb9-4f1c-8abc-3894d11ae038',
                72,
                77,
                72,
                87,
                74,
                54,
                5,
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('a5a1a54b-9497-490f-aa47-548214a17f0b', 'founder@agrisense.com', '$pbkdf2-sha256$29000$u5cy5jwnJKS0Vso5h/Cekw$2yBAK203j7tCrtMuG1u7heXuQkVpPnMic9qKmzs4ojw', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                '1f2ff4f4-6205-44a0-aa21-6f30f6def662',
                'a5a1a54b-9497-490f-aa47-548214a17f0b',
                'AgriSense',
                'agrisense',
                'Agritech',
                'IoT sensors and AI optimization for vertical farming yields.',
                'Seed',
                'Asia',
                'Singapore',
                '6-10',
                '2023-08-30',
                'https://www.agrisense.com',
                71,
                'MEDIUM',
                85,
                71,
                64,
                77,
                59,
                86,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                '4b90676a-18b9-4e81-98b0-262e316b4d61',
                '1f2ff4f4-6205-44a0-aa21-6f30f6def662',
                71,
                85,
                71,
                64,
                77,
                59,
                5,
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('e5e7faab-8a57-42c9-882a-79dca2a49467', 'founder@hydrogen.com', '$pbkdf2-sha256$29000$wPg/B8D4f6.11to7R4gRQg$ocvXA.kHmgnrPS2GFRVfNu7s6050A16Vo7I/AoSakQU', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                'a9f89593-1d06-421d-8cce-1f3a81658f7b',
                'e5e7faab-8a57-42c9-882a-79dca2a49467',
                'HydroGen',
                'hydrogen',
                'Cleantech',
                'High-efficiency hydrogen fuel cells for heavy-duty logistics.',
                'Series A',
                'North America',
                'Vancouver',
                '11-20',
                '2023-08-18',
                'https://www.hydrogen.com',
                74,
                'MEDIUM',
                74,
                88,
                57,
                77,
                75,
                78,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                'dcf90f0f-457d-4e8e-9659-e3464b4527bd',
                'a9f89593-1d06-421d-8cce-1f3a81658f7b',
                74,
                74,
                88,
                57,
                77,
                75,
                5,
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('e3483da4-73b8-429a-8506-297b012fafbf', 'founder@repacksolutions.com', '$pbkdf2-sha256$29000$SylljJESohTi/B/D2DtHCA$IQRmN4ehVhRwxlMq.ogW5a.Nhw1fj/ulr2kHL50XSVs', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                '739fd4d3-a6d6-4b04-b6bb-89e38472e8ee',
                'e3483da4-73b8-429a-8506-297b012fafbf',
                'RePack',
                'repack-solutions',
                'Cleantech',
                'Circular packaging service for e-commerce retailers to eliminate waste.',
                'Pre-Seed',
                'Europe',
                'Amsterdam',
                '3-5',
                '2025-03-14',
                'https://www.repack-solutions.com',
                77,
                'MEDIUM',
                73,
                75,
                78,
                92,
                71,
                83,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                '21c95580-ed7e-4cc8-a61f-700225c79f0a',
                '739fd4d3-a6d6-4b04-b6bb-89e38472e8ee',
                77,
                73,
                75,
                78,
                92,
                71,
                5,
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('83af5086-b6c8-4689-8242-aa93d7161f8d', 'founder@codepilot.com', '$pbkdf2-sha256$29000$uLfWWstZSwmhNIaQEqKUsg$qQ6qUetQ4khmkvxVscG/AdISKJNF7IfOGV0ymNUBeek', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                '4e572d3f-b118-41f6-af8b-6c9f0f2bf1fb',
                '83af5086-b6c8-4689-8242-aa93d7161f8d',
                'CodePilot',
                'codepilot',
                'AI',
                'Autonomous AI agent that maintains and updates legacy codebases.',
                'Seed',
                'North America',
                'Seattle',
                '6-10',
                '2024-11-21',
                'https://www.codepilot.com',
                71,
                'MEDIUM',
                66,
                64,
                89,
                74,
                62,
                80,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                'fec9a937-3450-44a4-956c-36e558366cab',
                '4e572d3f-b118-41f6-af8b-6c9f0f2bf1fb',
                71,
                66,
                64,
                89,
                74,
                62,
                5,
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('b4926dc7-2d1c-47b8-b6f2-d22843cd19bf', 'founder@datamesh.com', '$pbkdf2-sha256$29000$XAuBMGasdQ6htNY6Z8x5Tw$goAnTCw0ZbnWLzi0Q9Ep12Yp7ioYyC5fo3PnYRpkrX4', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                '8f9660f0-541a-481d-a859-61f3c1e964c0',
                'b4926dc7-2d1c-47b8-b6f2-d22843cd19bf',
                'DataMesh',
                'datamesh',
                'Enterprise SaaS',
                'Federated data governance platform for multinational corporations.',
                'Series A',
                'North America',
                'Toronto',
                '21-50',
                '2024-06-19',
                'https://www.datamesh.com',
                74,
                'MEDIUM',
                94,
                66,
                58,
                73,
                80,
                76,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                '892dcb44-e52b-4600-b4ab-5fa0acfbc1fa',
                '8f9660f0-541a-481d-a859-61f3c1e964c0',
                74,
                94,
                66,
                58,
                73,
                80,
                5,
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('d339fdd4-744a-4a2d-a474-0de5954fc09e', 'founder@voicesync.com', '$pbkdf2-sha256$29000$o9TaG0NorXVOCQEg5Ly3dg$WnXYez2CNZ01MGVNtUfnaUXW/mSmU4iubjmbobatCGM', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                '17cc73df-0ba0-4b61-859c-65792eddc2a3',
                'd339fdd4-744a-4a2d-a474-0de5954fc09e',
                'VoiceSync',
                'voicesync',
                'AI',
                'Real-time voice translation and dubbing for video content creators.',
                'Seed',
                'Asia',
                'Seoul',
                '6-10',
                '2024-06-16',
                'https://www.voicesync.com',
                72,
                'MEDIUM',
                75,
                48,
                68,
                96,
                75,
                89,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                'd695b28f-1d4f-4a97-aac6-0e542c4bf436',
                '17cc73df-0ba0-4b61-859c-65792eddc2a3',
                72,
                75,
                48,
                68,
                96,
                75,
                5,
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('ae7e186d-bcb8-4dbf-8b32-61ada9303a4f', 'founder@legaleagle.com', '$pbkdf2-sha256$29000$ak3p3fs/R8i5l/KeU.q9Fw$LeL477rMJdfnMKs7fiu6jD979JJPI/E4izsvZho7GA0', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                'da6c525b-f700-4fe0-8a7f-4bdec1d98cd5',
                'ae7e186d-bcb8-4dbf-8b32-61ada9303a4f',
                'LegalEagle',
                'legaleagle',
                'LegalTech',
                'AI contract review and automation for small law firms.',
                'Seed',
                'North America',
                'Chicago',
                '3-5',
                '2024-06-05',
                'https://www.legaleagle.com',
                67,
                'EARLY',
                79,
                75,
                57,
                62,
                65,
                73,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                'b110fb08-6feb-49f1-aabc-251830e64e34',
                'da6c525b-f700-4fe0-8a7f-4bdec1d98cd5',
                67,
                79,
                75,
                57,
                62,
                65,
                5,
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('e3af63ae-58f4-4cfb-b8ef-8ed843f0a03a', 'founder@retailiq.com', '$pbkdf2-sha256$29000$bc1ZqxXCGONcC.H8H2PsXQ$71Yy6S5mpIXfqfxtS7lQHTRtqUutXKGTsXxySOUvsrw', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                '62b4be3a-399a-4313-8908-655c0215afb8',
                'e3af63ae-58f4-4cfb-b8ef-8ed843f0a03a',
                'RetailIQ',
                'retailiq',
                'SaaS',
                'Predictive inventory analytics for brick-and-mortar retail chains.',
                'Seed',
                'Europe',
                'Paris',
                '6-10',
                '2024-11-04',
                'https://www.retailiq.com',
                74,
                'MEDIUM',
                88,
                83,
                55,
                81,
                63,
                68,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                'ae6d825a-8b04-4321-9bf2-d0741f450a2f',
                '62b4be3a-399a-4313-8908-655c0215afb8',
                74,
                88,
                83,
                55,
                81,
                63,
                5,
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('ce4cce44-b1bd-4606-9b7a-b12ea7d0e89d', 'founder@skillbridge.com', '$pbkdf2-sha256$29000$DCHEWItxDkFI6Z1zDmFsjQ$dPwNicmddKCarNS0ou8Yh.fiivsZCVPwc0dVevLF.hI', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                'f0678686-5f2c-4461-9c54-d4db4285aca4',
                'ce4cce44-b1bd-4606-9b7a-b12ea7d0e89d',
                'SkillBridge',
                'skillbridge',
                'Edtech',
                'VR-based vocational training platform for manufacturing jobs.',
                'Seed',
                'North America',
                'Detroit',
                '6-10',
                '2024-08-31',
                'https://www.skillbridge.com',
                72,
                'MEDIUM',
                90,
                60,
                92,
                64,
                56,
                72,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                '9f0e6459-81e6-4446-9667-2f90b701517e',
                'f0678686-5f2c-4461-9c54-d4db4285aca4',
                72,
                90,
                60,
                92,
                64,
                56,
                5,
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('e8c4545a-8bec-4478-b88f-bdf44b3d2211', 'founder@mathwhiz.com', '$pbkdf2-sha256$29000$3nsPAUBICaG01npvTek9xw$0qiM8Gh7sh1hzje4d8D2UGcQcxjJTdPD6lWG2r7q8GM', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                '297e1042-0d23-4e78-8855-8320f065f920',
                'e8c4545a-8bec-4478-b88f-bdf44b3d2211',
                'MathWhiz',
                'mathwhiz',
                'Edtech',
                'Adaptive gamified learning app for K-12 mathematics.',
                'Pre-Seed',
                'Asia',
                'Bangalore',
                '3-5',
                '2023-07-14',
                'https://www.mathwhiz.com',
                67,
                'EARLY',
                74,
                73,
                66,
                74,
                52,
                87,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                '31ffda8a-d675-4349-b3c1-5720355c0d37',
                '297e1042-0d23-4e78-8855-8320f065f920',
                67,
                74,
                73,
                66,
                74,
                52,
                5,
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('c88e395c-881e-40c2-bd07-803c1364ed96', 'founder@lingolive.com', '$pbkdf2-sha256$29000$YYxxbk3J2VtLCUFo7X3v3Q$OTggPC6pp6NEHVy.8jJBIyoM7t543Q6.zi16IxwJV3w', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                '8130c0cb-d85f-44d8-bf1e-480c02a2a8a1',
                'c88e395c-881e-40c2-bd07-803c1364ed96',
                'LingoLive',
                'lingolive',
                'Edtech',
                'Peer-to-peer immersive language learning marketplace.',
                'Series A',
                'South America',
                'São Paulo',
                '21-50',
                '2025-01-10',
                'https://www.lingolive.com',
                66,
                'EARLY',
                71,
                51,
                76,
                70,
                64,
                78,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                '38d0b86e-ec23-42af-9497-cedd963ea952',
                '8130c0cb-d85f-44d8-bf1e-480c02a2a8a1',
                66,
                71,
                51,
                76,
                70,
                64,
                5,
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('632da00c-8d1e-4ceb-bbb8-45c5905f8d98', 'founder@spacecargo.com', '$pbkdf2-sha256$29000$K4VwDuGcEyKEMOZ8D6G0Fg$66YyVw8G7Bisu5bvvJTxMqhJ385MvY4Ocg7XdSbvvuo', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                '950ab08e-be06-4d7a-8d83-bb083e89f709',
                '632da00c-8d1e-4ceb-bbb8-45c5905f8d98',
                'SpaceCargo',
                'spacecargo',
                'DeepTech',
                'Low-cost orbital delivery vehicles for small satellite constellations.',
                'Series A',
                'North America',
                'Los Angeles',
                '21-50',
                '2025-04-22',
                'https://www.spacecargo.com',
                73,
                'MEDIUM',
                91,
                71,
                60,
                81,
                66,
                81,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                'dda1ed4d-cc9e-4246-86bb-cb25857eef53',
                '950ab08e-be06-4d7a-8d83-bb083e89f709',
                73,
                91,
                71,
                60,
                81,
                66,
                5,
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('0989cc1b-75e4-444a-b4fa-6c470d023916', 'founder@urbanfarms.com', '$pbkdf2-sha256$29000$wFiLEYLwPseY05pTCgHgfA$21BqVlCficwAdaDU7gn3JopmOCOIciYxUBqQsOYQkBI', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                'f80cd336-2812-40c0-9133-ab1502a8873a',
                '0989cc1b-75e4-444a-b4fa-6c470d023916',
                'UrbanFarms',
                'urbanfarms',
                'Agritech',
                'Converting empty office spaces into high-yield hydroponic farms.',
                'Seed',
                'Europe',
                'London',
                '6-10',
                '2023-05-30',
                'https://www.urbanfarms.com',
                68,
                'EARLY',
                93,
                54,
                66,
                61,
                70,
                85,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                'e7e1febc-bf85-43a6-ace8-805c406c3644',
                'f80cd336-2812-40c0-9133-ab1502a8873a',
                68,
                93,
                54,
                66,
                61,
                70,
                5,
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('e6c29ead-0c6c-44c0-b517-edde1f11e537', 'founder@biofab.com', '$pbkdf2-sha256$29000$NwZgTMm5tzaGsHbOmfP.Pw$I1uAdpg.c4TTU4kyRzqpaw2N5BUbQZIbpWcRUIjndyg', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                '900e79d1-a7d3-4818-a37d-bf658a18dee8',
                'e6c29ead-0c6c-44c0-b517-edde1f11e537',
                'BioFab',
                'biofab',
                'Biotech',
                '3D bioprinting of skin tissue for cosmetic testing.',
                'Seed',
                'North America',
                'Boston',
                '6-10',
                '2024-07-11',
                'https://www.biofab.com',
                71,
                'MEDIUM',
                82,
                55,
                57,
                90,
                71,
                89,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                'e67b7e6b-29fc-4691-bbdf-68f50a4c74c6',
                '900e79d1-a7d3-4818-a37d-bf658a18dee8',
                71,
                82,
                55,
                57,
                90,
                71,
                5,
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('1a5050cf-a664-4d2e-aa7a-637a492cee03', 'founder@cybershield.com', '$pbkdf2-sha256$29000$KCUkRAhh7D1HyBkDQEhJyQ$1dmXs/y14iOuUHPnnreeeW.Riw4YE7gHNVgCDoeUwAc', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                'cac35ed4-9334-4256-a3da-fed4585d64a3',
                '1a5050cf-a664-4d2e-aa7a-637a492cee03',
                'CyberShield',
                'cybershield',
                'Cybersecurity',
                'Automated penetration testing for cloud-native applications.',
                'Series A',
                'Asia',
                'Tel Aviv',
                '21-50',
                '2023-07-03',
                'https://www.cybershield.com',
                68,
                'EARLY',
                62,
                51,
                73,
                74,
                83,
                66,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                '90deb492-b663-4b31-af9b-704505ec6583',
                'cac35ed4-9334-4256-a3da-fed4585d64a3',
                68,
                62,
                51,
                73,
                74,
                83,
                5,
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('65d4add0-235c-49d7-b79b-1874c2149e63', 'founder@propchain.com', '$pbkdf2-sha256$29000$AQBgLMV4T.k9R8h5D6G0dg$T6.wERvspYIAzjTg3Ftj3c/Gn4/nVYpmnxyWpb5T7Eo', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                '855584c8-325c-4a5a-bcb3-e48ff5543963',
                '65d4add0-235c-49d7-b79b-1874c2149e63',
                'PropChain',
                'propchain',
                'PropTech',
                'Tokenized real estate investment platform for retail investors.',
                'Seed',
                'North America',
                'Miami',
                '6-10',
                '2023-11-23',
                'https://www.propchain.com',
                73,
                'MEDIUM',
                70,
                60,
                92,
                72,
                72,
                64,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                'e13033c0-8064-4826-a2fd-c3afb3bf0990',
                '855584c8-325c-4a5a-bcb3-e48ff5543963',
                73,
                70,
                60,
                92,
                72,
                72,
                5,
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('5b68c913-838d-4360-aa2a-5b98b12fd6e4', 'founder@logiroute.com', '$pbkdf2-sha256$29000$RAjB2DtHaK11DiGEcE4JAQ$FuJtTN1jzJc94Si2G/3SZuu8tV3HlrlC/H50pmK5gVE', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                '12c1ef14-d0e6-4d19-af78-0a8f00a96edb',
                '5b68c913-838d-4360-aa2a-5b98b12fd6e4',
                'LogiRoute',
                'logiroute',
                'Logistics',
                'Last-mile delivery optimization using swarm intelligence algorithms.',
                'Pre-Seed',
                'Asia',
                'Mumbai',
                '3-5',
                '2023-12-24',
                'https://www.logiroute.com',
                75,
                'MEDIUM',
                67,
                79,
                83,
                67,
                79,
                70,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                '8a84e866-b528-440e-baa5-50b1729efd86',
                '12c1ef14-d0e6-4d19-af78-0a8f00a96edb',
                75,
                67,
                79,
                83,
                67,
                79,
                5,
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('6e87f553-d4f9-4f51-80e8-686aaf480fc3', 'founder@fashionai.com', '$pbkdf2-sha256$29000$9T5nbK3VWuudU4pxTknJOQ$dLtg7DkBxIOAuPDUUltAInzmRn4bnEiXypcq0ms4paY', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                '86632414-ab50-40e8-b24d-2fe2330b4e74',
                '6e87f553-d4f9-4f51-80e8-686aaf480fc3',
                'FashionAI',
                'fashionai',
                'E-commerce',
                'Virtual try-on technology for online fashion retailers.',
                'Seed',
                'Europe',
                'Milan',
                '6-10',
                '2023-05-08',
                'https://www.fashionai.com',
                76,
                'MEDIUM',
                83,
                67,
                78,
                95,
                57,
                79,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                '080aacf2-b70b-426f-8d52-deb8dc5fdafe',
                '86632414-ab50-40e8-b24d-2fe2330b4e74',
                76,
                83,
                67,
                78,
                95,
                57,
                5,
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('7d2d3612-f4ae-4b79-90cd-d09eda6b28de', 'founder@cleanocean.com', '$pbkdf2-sha256$29000$WytlLOU8Z2wtxRiDEAIgJA$MHWdtQLvhLQF11j8SVbz/ZqI0G.Yeh2drrOC5aLuHIQ', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                '8bb85925-8b95-479a-ba8c-85097664c0ed',
                '7d2d3612-f4ae-4b79-90cd-d09eda6b28de',
                'CleanOcean',
                'cleanocean',
                'Cleantech',
                'Autonomous drones for harbor and coastline waste cleanup.',
                'Pre-Seed',
                'Asia',
                'Tokyo',
                '3-5',
                '2023-12-02',
                'https://www.cleanocean.com',
                68,
                'EARLY',
                82,
                40,
                80,
                85,
                57,
                89,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                'b5b3cc64-f441-4737-b278-4f013bf154a0',
                '8bb85925-8b95-479a-ba8c-85097664c0ed',
                68,
                82,
                40,
                80,
                85,
                57,
                5,
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('58b7caf0-89a1-48e3-b623-5ac4625b4129', 'founder@quantumkey.com', '$pbkdf2-sha256$29000$6X1vzfkfQ0ipVcqZ89773w$L4x4d0gFvWI4gk6z2YH4tTUhCIdK72nlRMJ6BkXeRkM', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                '8f15d45f-6738-440e-95bd-919e98c2693f',
                '58b7caf0-89a1-48e3-b623-5ac4625b4129',
                'QuantumKey',
                'quantumkey',
                'DeepTech',
                'Quantum-resistant encryption chips for IoT devices.',
                'Series A',
                'Europe',
                'Munich',
                '11-20',
                '2024-08-03',
                'https://www.quantumkey.com',
                70,
                'EARLY',
                66,
                56,
                64,
                93,
                71,
                87,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                '3a413cc3-9812-48b3-bcbf-8c5ad4736e13',
                '8f15d45f-6738-440e-95bd-919e98c2693f',
                70,
                66,
                56,
                64,
                93,
                71,
                5,
                NOW()
            );
        
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('cacd20c7-7d2e-4273-9a94-97e4e6d54c71', 'founder@edgylabs.com', '$pbkdf2-sha256$29000$xphTKqWUcg6hdI5RqjVmzA$2rAU1jIF6DHuyBp81azxBQUzjLZ8zJp0UKuO/ZbmEuo', 'STARTUP', NOW());

            INSERT INTO startups (
                id, user_id, name, slug, sector, description, stage, region, location, team_size, founded_date, website_url,
                readiness_score, readiness_band, execution_score, traction_score, market_score, team_score, capital_efficiency_score, public_review_score, visibility_status, created_at
            ) VALUES (
                '58d217ee-202f-436d-bad7-97b5ff04bbc4',
                'cacd20c7-7d2e-4273-9a94-97e4e6d54c71',
                'EdgyLabs',
                'edgylabs',
                'AI',
                'Edge computing framework for AI inference on low-power devices.',
                'Seed',
                'North America',
                'San Jose',
                '6-10',
                '2025-05-05',
                'https://www.edgylabs.com',
                80,
                'MEDIUM',
                83,
                85,
                88,
                81,
                64,
                66,
                'VISIBLE',
                NOW()
            );
        

            INSERT INTO readiness_scores (
                id, startup_id, score, execution_score, traction_score, market_score, team_score, capital_efficiency_score, confidence_band, calculated_at
            ) VALUES (
                '7d685b83-0928-43af-b542-79d71f8ec389',
                '58d217ee-202f-436d-bad7-97b5ff04bbc4',
                80,
                83,
                85,
                88,
                81,
                64,
                5,
                NOW()
            );
        

            INSERT INTO stories (id, slug, title, type, summary, content, related_tags, created_at)
            VALUES (
                '39c16075-9987-454f-980d-bf73570bf16f',
                'rise-vertical-ai-agents',
                'The Rise of Vertical AI Agents',
                'ecosystem_insight',
                'Why general purpose LLMs are giving way to specialized agents in law, medicine, and engineering.',
                'As the dust settles on the initial generative AI boom, investors are shifting focus to ''vertical AI''—specialized models trained on proprietary datasets for specific industries. Unlike broad tools like ChatGPT, these agents integrate deeply into professional workflows...',
                '["Trends", "VC", "Market"]',
                NOW()
            );
        

            INSERT INTO stories (id, slug, title, type, summary, content, related_tags, created_at)
            VALUES (
                'a58e0118-8ee6-4858-b99f-e28c70cd3bec',
                'series-a-crunch-2026',
                'Series A Crunch: What Founders Need to Know',
                'decision_story',
                'The bar for Series A has raised significantly. Here are the 5 metrics VCs are looking for now.',
                'Gone are the days of raising on pure vision. In 2026, Series A investors demand clear evidence of product-market fit, referenced by at least $1M ARR or equivalent engagement metrics. The ''growth at all costs'' mindset has been replaced by ''unit economics first''...',
                '["Trends", "VC", "Market"]',
                NOW()
            );
        

            INSERT INTO stories (id, slug, title, type, summary, content, related_tags, created_at)
            VALUES (
                'c5849b13-7d41-490c-b2d0-43329afe31c8',
                'climate-tech-hardware',
                'Climate Tech''s ''Hardware Problem'' is Solved?',
                'ecosystem_insight',
                'New manufacturing techniques are reducing the CAPEX requirements for green energy startups.',
                'Building hardware has always been hard, but new rapid prototyping and 3D metal printing technologies are lowering the barrier to entry for fusion, battery, and carbon capture startups...',
                '["Trends", "VC", "Market"]',
                NOW()
            );
        

            INSERT INTO stories (id, slug, title, type, summary, content, related_tags, created_at)
            VALUES (
                'cc7dbab3-1e4f-4b14-9224-6f741ed8eb70',
                'founder-mental-health-2025',
                'Founder Mental Health Report 2025',
                'ecosystem_insight',
                'Burnout rates are down, but isolation is up. How remote-first founders are coping.',
                'A new study reveals that while remote work has reduced commute stress, it has increased the feeling of isolation among early-stage founders. Peer networks and co-living spaces are emerging as the new antidote...',
                '["Trends", "VC", "Market"]',
                NOW()
            );
        

            INSERT INTO stories (id, slug, title, type, summary, content, related_tags, created_at)
            VALUES (
                'df2be24d-ae09-43b1-8525-99d51ce89ea2',
                'growth-to-profitability-pivot',
                'From ''Growth'' to ''Profitability'': The Pivot',
                'customer_story',
                'How one SaaS unicorn slashed burn by 60% and achieved profitability in 12 months.',
                'The story of CloudScale is a lesson in discipline. Facing a frozen funding market, the CEO made the tough call to cut 30% of the workforce and refocus on their core enterprise customers...',
                '["Trends", "VC", "Market"]',
                NOW()
            );
        

            INSERT INTO stories (id, slug, title, type, summary, content, related_tags, created_at)
            VALUES (
                '56eb20a5-c74f-478e-9214-d83acdbaf9fc',
                'sea-tech-renaissance',
                'The Southeast Asian Tech Renaissance',
                'ecosystem_insight',
                'Indonesia and Vietnam are emerging as the hottest hubs for fintech innovation.',
                'With a massive unbanked population and high mobile penetration, Southeast Asia is leapfrogging traditional banking infrastructure. Startups in Jakarta and Ho Chi Minh City are attracting record foreign capital...',
                '["Trends", "VC", "Market"]',
                NOW()
            );
        

            INSERT INTO stories (id, slug, title, type, summary, content, related_tags, created_at)
            VALUES (
                '56f852d0-420c-4895-ae62-e06b9a2516cb',
                'community-is-the-new-moat',
                'Why ''Community'' is the New ''Moat''',
                'decision_story',
                'Software can be copied. A loyal, engaged community cannot. Here is how to build one.',
                'In an era where AI can replicate code in seconds, defensibility comes from brand and community. We analyze three startups that won by building movements, not just products...',
                '["Trends", "VC", "Market"]',
                NOW()
            );
        

            INSERT INTO stories (id, slug, title, type, summary, content, related_tags, created_at)
            VALUES (
                'a649137f-47fd-4262-9f87-4f2eae4eb767',
                'biotech-golden-age',
                'Biotech''s Golden Age',
                'ecosystem_insight',
                'CRISPR and AI drug discovery are accelerating time-to-market for life-saving therapies.',
                'The convergence of biology and computing is shortening drug discovery timelines from years to months. We are entering a golden age where personalized medicine becomes scalable...',
                '["Trends", "VC", "Market"]',
                NOW()
            );
        

            INSERT INTO stories (id, slug, title, type, summary, content, related_tags, created_at)
            VALUES (
                'c0f9af8e-74c4-452a-81c4-b2fe86bbbb5a',
                'death-of-pitch-deck',
                'The Death of the Pitch Deck?',
                'decision_story',
                'More investors are asking for data rooms and Notion memos over shiny 20-slide decks.',
                'Flashy design is out; substance is in. A growing trend among Seed investors is to request a simple memo outlining the thesis and a live data dashboard, skipping the traditional pitch deck theater...',
                '["Trends", "VC", "Market"]',
                NOW()
            );
        

            INSERT INTO stories (id, slug, title, type, summary, content, related_tags, created_at)
            VALUES (
                'ba6239dc-3578-4f71-b078-568993a38c35',
                'space-economy-manufacturing',
                'Space Economy: Beyond Satellites',
                'ecosystem_insight',
                'In-orbit manufacturing is becoming a reality. Who are the key players?',
                'Microgravity offers unique environments for manufacturing optical fibers and pharmaceuticals. Startups are now racing to build the first orbital factories...',
                '["Trends", "VC", "Market"]',
                NOW()
            );
        

            INSERT INTO stories (id, slug, title, type, summary, content, related_tags, created_at)
            VALUES (
                '651734b6-a152-4e2d-a165-7092313447f1',
                'edtech-ai-era',
                'Edtech for the AI Era',
                'ecosystem_insight',
                'Education systems are failing to keep up. Startups are filling the gap with upskilling platforms.',
                'As AI automates white-collar tasks, the demand for continuous upskilling is exploding. Platforms that offer micro-credentials in prompt engineering and AI ethics are seeing 300% YoY growth...',
                '["Trends", "VC", "Market"]',
                NOW()
            );
        

            INSERT INTO stories (id, slug, title, type, summary, content, related_tags, created_at)
            VALUES (
                'b4967a05-ae16-4ee4-b11c-b74a4b37b481',
                'bootstrapping-vs-vc-2026',
                'Bootstrapping vs. VC: A 2026 Guide',
                'decision_story',
                'Capital is expensive. When does it make sense to take outside money?',
                'With interest rates stabilizing but equity demanding high premiums, founders are reconsidering the VC path. This guide breaks down the math of dilution versus speed...',
                '["Trends", "VC", "Market"]',
                NOW()
            );
        