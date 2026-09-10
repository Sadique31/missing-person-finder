# Missing Person Finder

An AI-based missing person search system using face recognition and one-to-many face matching.

## Project Overview

The goal of this project is to develop a system that can help find potential matches for a missing person from a database of registered individuals.

A user can provide a photograph, and the system generates a facial embedding and searches the stored face embeddings to rank the most similar candidates.

The system is designed as a **candidate-search and human-verification system**, rather than an automatic identity decision system.

## Current Progress

### Phase 1–4: Face Recognition Prototype

The current prototype includes:

- Face detection using OpenCV
- Face feature extraction using ArcFace
- 512-dimensional face embeddings
- Cosine distance-based face comparison
- One-to-many face search
- Person-level candidate ranking
- Precomputed embedding database
- Top-1 and Top-3 evaluation
- FAR/FRR threshold analysis

## System Architecture

```text
Input Photograph
       |
       v
Face Detection
       |
       v
ArcFace Model
       |
       v
512-D Face Embedding
       |
       v
Compare with Stored Embeddings
       |
       v
Rank Candidate Matches
       |
       v
Potential Matches
       |
       v
Human Verification