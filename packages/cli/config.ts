function getEnvSafe(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} was undefined`);
    }
    return value;
}
export const config = {
    get domainName(): string {
        return getEnvSafe('DOMAIN_NAME');
    },
    get certificateArn(): string {
        return getEnvSafe('CERTIFICATE_ARN');
    },
    get environment(): string {
        return getEnvSafe('ENVIRONMENT');
    },
    get webAclid(): string {
        return getEnvSafe('WEB_ACLID');
    },
    get threadsStack(): string {
        return getEnvSafe('THREADS_STACK');
    },
    get scheduledPaymentsStack(): string {
        return getEnvSafe('SCHEDULED_PAYMENTS_STACK');
    },
    get vaultStack(): string {
        return getEnvSafe('VAULT_STACK');
    },
    get magicTokenStack(): string {
        return getEnvSafe('MAGIC_TOKEN_STACK');
    },
    get threadsScope(): string {
        return getEnvSafe('THREADS_SCOPE');
    },
    get mattersCreatedTopicArn(): string {
        return getEnvSafe('MATTERS_CREATED_TOPIC_ARN');
    },
    get jobStatusUpdateTopicArn(): string {
        return getEnvSafe('JOB_STATUS_UPDATE_TOPIC_ARN');
    },
    get analyticsId(): string {
        return getEnvSafe('ANALYTICS_ID');
    },
    get stackName(): string {
        return getEnvSafe('STACK_NAME');
    },
    get threadsApiUrl(): string {
        return getEnvSafe('THREADS_API_URL');
    },
    get threadsApiKeyName(): string {
        return getEnvSafe('THREADS_API_KEY_NAME');
    },
    get disablePaymentDetails(): string {
        return getEnvSafe('DISABLE_PAYMENT_DETAILS');
    },
    get paymentApiUrl(): string {
        return getEnvSafe('PAYMENT_API_URL');
    },
    get apiKeyName(): string {
        return getEnvSafe('API_KEY_NAME');
    },
    get paymentsApiKeyName(): string {
        return getEnvSafe('PAYMENTS_API_KEY_NAME');
    },
    get portalApiUrl(): string {
        return getEnvSafe('PORTAL_API_URL');
    },
    get indexBucket(): string {
        return getEnvSafe('INDEX_BUCKET');
    },
    get securityApiKeyName(): string {
        return getEnvSafe('SECURITY_API_KEY_NAME');
    },
    components: {
        get getCsaPage() {
            return {
                stackName: getEnvSafe('STACK_NAME'),
                threadsApiUrl: getEnvSafe('THREADS_API_URL'),
                threadsScope: getEnvSafe('THREADS_SCOPE'),
                threadsApiKeyName: getEnvSafe('THREADS_API_KEY_NAME'),
                disablePaymentDetails: getEnvSafe('DISABLE_PAYMENT_DETAILS')
            };
        },
        get getJobsPage() {
            return {
                stackName: getEnvSafe('STACK_NAME'),
                threadsApiUrl: getEnvSafe('THREADS_API_URL'),
                threadsScope: getEnvSafe('THREADS_SCOPE'),
                threadsApiKeyName: getEnvSafe('THREADS_API_KEY_NAME')
            };
        },
        get putPaymentDetails() {
            return {
                stackName: getEnvSafe('STACK_NAME'),
                threadsApiUrl: getEnvSafe('THREADS_API_URL'),
                paymentApiUrl: getEnvSafe('PAYMENT_API_URL'),
                apiKeyName: getEnvSafe('API_KEY_NAME'),
                paymentsApiKeyName: getEnvSafe('PAYMENTS_API_KEY_NAME'),
                threadsScope: getEnvSafe('THREADS_SCOPE'),
                threadsApiKeyName: getEnvSafe('THREADS_API_KEY_NAME')
            };
        },
        get signingCompleteWatcher() {
            return {
                stackName: getEnvSafe('STACK_NAME'),
                threadsApiUrl: getEnvSafe('THREADS_API_URL'),
                paymentApiUrl: getEnvSafe('PAYMENT_API_URL'),
                portalApiUrl: getEnvSafe('PORTAL_API_URL'),
                threadsApiKeyName: getEnvSafe('THREADS_API_KEY_NAME'),
                paymentsApiKeyName: getEnvSafe('PAYMENTS_API_KEY_NAME'),
                threadsScope: getEnvSafe('THREADS_SCOPE')
            };
        },
        get paymentDetailsCompleteWatcher() {
            return {
                stackName: getEnvSafe('STACK_NAME'),
                threadsApiUrl: getEnvSafe('THREADS_API_URL'),
                threadsApiKeyName: getEnvSafe('THREADS_API_KEY_NAME'),
                threadsScope: getEnvSafe('THREADS_SCOPE')
            };
        },
        get csaIndexer() {
            return {
                stackName: getEnvSafe('STACK_NAME'),
                threadsApiUrl: getEnvSafe('THREADS_API_URL'),
                threadsApiKeyName: getEnvSafe('THREADS_API_KEY_NAME'),
                threadsScope: getEnvSafe('THREADS_SCOPE'),
                indexBucket: getEnvSafe('INDEX_BUCKET')
            };
        },
        get saveScheduleOnCsaCreate() {
            return {
                stackName: getEnvSafe('STACK_NAME'),
                threadsApiUrl: getEnvSafe('THREADS_API_URL'),
                threadsApiKeyName: getEnvSafe('THREADS_API_KEY_NAME'),
                threadsScope: getEnvSafe('THREADS_SCOPE'),
                paymentApiUrl: getEnvSafe('PAYMENT_API_URL'),
                paymentsApiKeyName: getEnvSafe('PAYMENTS_API_KEY_NAME')
            };
        },
        get setCsaStatusWatcher() {
            return {
                stackName: getEnvSafe('STACK_NAME'),
                threadsApiUrl: getEnvSafe('THREADS_API_URL'),
                threadsApiKeyName: getEnvSafe('THREADS_API_KEY_NAME'),
                threadsScope: getEnvSafe('THREADS_SCOPE')
            };
        },
        get mattersCreatedWatcher() {
            return {
                stackName: getEnvSafe('STACK_NAME'),
                threadsApiUrl: getEnvSafe('THREADS_API_URL'),
                paymentApiUrl: getEnvSafe('PAYMENT_API_URL'),
                portalApiUrl: getEnvSafe('PORTAL_API_URL'),
                threadsApiKeyName: getEnvSafe('THREADS_API_KEY_NAME'),
                paymentsApiKeyName: getEnvSafe('PAYMENTS_API_KEY_NAME'),
                threadsScope: getEnvSafe('THREADS_SCOPE'),
                indexBucket: getEnvSafe('INDEX_BUCKET')
            };
        },
        get jobStatusUpdateWatcher() {
            return {
                stackName: getEnvSafe('STACK_NAME'),
                threadsApiUrl: getEnvSafe('THREADS_API_URL'),
                portalApiUrl: getEnvSafe('PORTAL_API_URL'),
                threadsApiKeyName: getEnvSafe('THREADS_API_KEY_NAME'),
                threadsScope: getEnvSafe('THREADS_SCOPE'),
                securityApiKeyName: getEnvSafe('SECURITY_API_KEY_NAME')
            };
        }
    }
};
