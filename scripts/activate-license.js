#!/usr/bin/env node

/**
 * Script to activate Telerik license with graceful error handling for CI environments
 */

import { execSync } from 'child_process';
import fs from 'fs';

function hasLicenseFile() {
  return fs.existsSync('./telerik-license.txt') || fs.existsSync('./kendo-ui-license.txt');
}

function hasLicenseEnvVar() {
  return process.env.TELERIK_LICENSE || process.env.KENDO_UI_LICENSE;
}

function isCI() {
  return process.env.CI || process.env.GITHUB_ACTIONS || process.env.VERCEL;
}

function activateLicense() {
  try {
    if (hasLicenseFile() || hasLicenseEnvVar()) {
      console.log('[License] Activating Telerik license...');
      execSync('npx kendo-ui-license activate', { stdio: 'inherit' });
      console.log('[License] License activated successfully!');
    } else if (isCI()) {
      console.log('[License] No license key found in CI environment - this is expected for public repositories or trial projects');
      console.log('[License] Skipping license activation in CI');
    } else {
      console.warn('[License] Warning: No Telerik license key found locally. Premium components may show watermarks.');
      console.warn('[License] Please add your license key to continue using premium features.');
    }
  } catch (error) {
    if (isCI()) {
      console.log('[License] License activation failed in CI environment - continuing without license');
      console.log('[License] This is expected if no license secrets are configured');
    } else {
      console.error('[License] License activation failed:', error.message);
      console.error('[License] Please check your license key and try again');
      process.exit(1);
    }
  }
}

activateLicense();
