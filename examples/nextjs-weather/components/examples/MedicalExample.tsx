'use client';

import React, { useState } from 'react';
import { useEncrypt, useFHEVM } from '@fhevm/sdk';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

/**
 * Medical Example Component
 * Demonstrates confidential medical data handling using FHE
 */
export default function MedicalExample() {
  const [heartRate, setHeartRate] = useState<string>('');
  const [bloodPressure, setBloodPressure] = useState<string>('');
  const [glucose, setGlucose] = useState<string>('');
  const { isReady } = useFHEVM();
  const { encrypt: encryptHR, data: encryptedHR, isLoading: loadingHR } = useEncrypt();
  const { encrypt: encryptBP, data: encryptedBP, isLoading: loadingBP } = useEncrypt();
  const { encrypt: encryptGlucose, data: encryptedGlucose, isLoading: loadingGlucose } = useEncrypt();

  const handleEncryptVital = async (
    value: string,
    encryptFn: any,
    vitalName: string,
    min: number,
    max: number
  ) => {
    if (!value) return;
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < min || numValue > max) {
      alert(`Please enter a valid ${vitalName} (${min}-${max})`);
      return;
    }
    await encryptFn(numValue, 'euint16');
  };

  return (
    <Card
      title="🏥 Confidential Medical Records"
      subtitle="HIPAA-compliant health data on blockchain"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="alert alert-info">
          <strong>Use Case:</strong> Healthcare providers can store and analyze patient data
          on blockchain while maintaining HIPAA compliance through encryption.
        </div>

        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>
            Encrypt Vital Signs
          </h4>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Input
                type="number"
                label="Heart Rate (BPM)"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                placeholder="60-200"
                disabled={!isReady}
                helperText="Normal range: 60-100 BPM"
              />
              <Button
                variant="primary"
                size="small"
                onClick={() => handleEncryptVital(heartRate, encryptHR, 'heart rate', 40, 220)}
                disabled={!isReady || !heartRate || loadingHR}
                isLoading={loadingHR}
              >
                Encrypt Heart Rate
              </Button>
              {encryptedHR && (
                <span className="badge badge-success" style={{ alignSelf: 'flex-start' }}>
                  Heart Rate Encrypted
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Input
                type="number"
                label="Blood Pressure (Systolic)"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                placeholder="90-180"
                disabled={!isReady}
                helperText="Normal range: 90-120 mmHg"
              />
              <Button
                variant="primary"
                size="small"
                onClick={() => handleEncryptVital(bloodPressure, encryptBP, 'blood pressure', 70, 200)}
                disabled={!isReady || !bloodPressure || loadingBP}
                isLoading={loadingBP}
              >
                Encrypt Blood Pressure
              </Button>
              {encryptedBP && (
                <span className="badge badge-success" style={{ alignSelf: 'flex-start' }}>
                  Blood Pressure Encrypted
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Input
                type="number"
                label="Blood Glucose (mg/dL)"
                value={glucose}
                onChange={(e) => setGlucose(e.target.value)}
                placeholder="70-140"
                disabled={!isReady}
                helperText="Normal range: 70-100 mg/dL (fasting)"
              />
              <Button
                variant="primary"
                size="small"
                onClick={() => handleEncryptVital(glucose, encryptGlucose, 'glucose', 50, 400)}
                disabled={!isReady || !glucose || loadingGlucose}
                isLoading={loadingGlucose}
              >
                Encrypt Glucose Level
              </Button>
              {encryptedGlucose && (
                <span className="badge badge-success" style={{ alignSelf: 'flex-start' }}>
                  Glucose Encrypted
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="alert alert-success">
          <strong>Privacy-Preserving Analytics:</strong>
          <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem', lineHeight: '1.8' }}>
            <li>Smart contracts can check if vitals are in normal range</li>
            <li>Calculate aggregate statistics across patient populations</li>
            <li>Trigger alerts for abnormal readings without revealing actual values</li>
            <li>Research institutions can analyze trends without accessing individual data</li>
          </ul>
        </div>

        <div>
          <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
            HIPAA Compliance Benefits
          </h4>
          <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            <li><strong>Encryption at Rest:</strong> All PHI stored encrypted on blockchain</li>
            <li><strong>Access Control:</strong> Only authorized providers can decrypt</li>
            <li><strong>Audit Trail:</strong> All access attempts recorded on-chain</li>
            <li><strong>Data Integrity:</strong> Blockchain ensures data hasn't been tampered with</li>
            <li><strong>Patient Privacy:</strong> Computations possible without exposing data</li>
          </ul>
        </div>

        <div className="alert alert-warning">
          <strong>Medical Use Cases:</strong>
          <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem', lineHeight: '1.8' }}>
            <li>Clinical trials with blinded data</li>
            <li>Insurance claims processing</li>
            <li>Drug prescription validation</li>
            <li>Emergency access protocols</li>
            <li>Multi-institution research</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
