# Database Structure: Real Estate Lead-Generation App

## users
- id (uuid, pk)
- email (string, unique)
- password_hash (string)
- name (string)
- role (enum: admin, realtor)
- created_at (datetime)

## listings
- id (uuid, pk)
- user_id (uuid, fk -> users.id)
- url (string)
- title (string)
- address (string)
- price (decimal)
- description (text)
- media_urls (json)
- status (enum: active, inactive, sold)
- created_at (datetime)

## leads
- id (uuid, pk)
- listing_id (uuid, fk -> listings.id)
- name (string)
- email (string)
- phone (string)
- message (text)
- status (enum: new, contacted, qualified, lost)
- created_at (datetime)

## appointments
- id (uuid, pk)
- listing_id (uuid, fk -> listings.id)
- lead_id (uuid, fk -> leads.id)
- realtor_id (uuid, fk -> users.id)
- scheduled_time (datetime)
- status (enum: scheduled, completed, cancelled)
- created_at (datetime)

## knowledge_bases
- id (uuid, pk)
- listing_id (uuid, fk -> listings.id)
- document_url (string)
- uploaded_at (datetime)

## messages
- id (uuid, pk)
- listing_id (uuid, fk -> listings.id)
- sender (enum: user, ai)
- content (text)
- timestamp (datetime)

## crm_pipeline
- id (uuid, pk)
- lead_id (uuid, fk -> leads.id)
- stage (enum: new, contacted, qualified, proposal, closed, lost)
- notes (text)
- updated_at (datetime) 