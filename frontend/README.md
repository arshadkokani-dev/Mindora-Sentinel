# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Project Overview

Mindora-Sentinel is an AI-powered dynamic mental health monitoring and decision-support platform designed to help authorised caseworkers and counsellors identify changing distress patterns over time.

The system combines periodic wellness check-ins, dynamic distress scoring, longitudinal risk analysis, explainable alerts, predictive risk indicators, automated case prioritisation, intervention recommendations, and role-based case management.

## Deployment

Mindora-Sentinel is deployed as a separate frontend and backend service with a cloud-hosted MongoDB database. The prototype supports role-based access for users and authorised caseworkers/counsellors.

The first request after a period of inactivity may take a short time due to cloud service initialization.