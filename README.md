<img width="2140" height="1304" alt="image" src="https://github.com/user-attachments/assets/d26bdbe5-4516-4b6c-946d-d5976ebcf049" />

# 架构图
<img width="6013" height="2582" alt="image" src="https://github.com/user-attachments/assets/ac2b6013-c42a-45f7-a9cb-89b4ac1e1efc" />

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>
# 案例
<img width="1518" height="1402" alt="image" src="https://github.com/user-attachments/assets/048de73d-cdea-4f39-9d3f-41a6de2d259f" />
<img width="1528" height="948" alt="image" src="https://github.com/user-attachments/assets/4738530b-3450-4339-8b57-be94c7c1583c" />
<img width="1526" height="1184" alt="image" src="https://github.com/user-attachments/assets/088d40cd-9f73-4eaa-bef5-09a72c4c5a2a" />

# Description
RefundMultiAgents is a secure, Gemini-driven multi-agent system that converts messy evidence (PDFs, images, screenshots) into a clean, verifiable refund appeal in minutes. The pipeline extracts structured facts, cites policy/TOS clauses with short quotes and section IDs, proposes a 3-step recovery plan with SLAs, and generates a polished <350-word appeal letter—guardrailed for PII and hallucinations. Current demo runs in Google AI Studio (Gemini 2.5-flash); the roadmap includes Cloud Run services for evidence upload, Pub/Sub processing, Firestore case storage, and Document AI OCR.

Key features
	•	Evidence → normalized fields (booking, itinerary, amounts, timelines, platform)
	•	Legal claims with clause/section citations (short, testable quotes)
	•	Finance playbook: platform → merchant → issuer/chargeback (with SLA hours)
	•	Generator → Critic → Refiner loop + Security guardrails (PII minimization, tone/length checks)
	•	English-only, concise, auditable outputs (JSON + final letter)

Quickstart (AI Studio)
	1.	Open Google AI Studio → new chat → select Gemini 2.5-flash.
	2.	Upload a sample ticket/receipt PDF.
	3.	Paste the “Fast-lane Prompt” from /prompts/fastlane.txt and run to get normalized_fields, claims, execution_steps, and appeal_draft.

# Planned structure
/prompts/         # global/orchestrator/evidence/legal/finance/security/generator-critic-refiner
/samples/         # example PDFs/images
/docs/            # architecture diagram & usage notes
/studio/          # AI Studio prompt snippets & screenshots
/cloud/           # (roadmap) Cloud Run services: upload, extractor, orchestrator

# Try it:https://refund-multi-agent-system-912794403895.us-west1.run.app
# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1NpiPkA9AU__0CnlHQwBYMDzjrlDg4jGJ


