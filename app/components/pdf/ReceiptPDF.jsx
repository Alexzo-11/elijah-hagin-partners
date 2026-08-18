'use client';

import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2' },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2ZL7.woff2', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 50,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Inter',
  },
  // ===== HEADER =====
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '3px solid #E51913',
    paddingBottom: 20,
    marginBottom: 25,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBox: {
    width: 55,
    height: 55,
    backgroundColor: '#E51913',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  ministryName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A4C4E',
    letterSpacing: 0.5,
  },
  ministrySub: {
    fontSize: 9,
    color: '#8A8C8E',
    marginTop: 2,
  },
  receiptTitleContainer: {
    alignItems: 'flex-end',
  },
  receiptTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E51913',
    letterSpacing: 2,
  },
  receiptNumber: {
    fontSize: 10,
    color: '#8A8C8E',
    marginTop: 4,
  },

  // ===== STATUS BADGE =====
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 15,
    alignSelf: 'flex-end',
  },
  statusBadgeSuccess: {
    backgroundColor: '#D1FAE5',
  },
  statusBadgePending: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeFailed: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  statusTextSuccess: {
    color: '#059669',
  },
  statusTextPending: {
    color: '#D97706',
  },
  statusTextFailed: {
    color: '#DC2626',
  },

  // ===== SECTION TITLES =====
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4A4C4E',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  sectionTitleAccent: {
    width: 30,
    height: 3,
    backgroundColor: '#E51913',
    marginTop: 4,
    borderRadius: 2,
  },

  // ===== DIVIDER =====
  divider: {
    borderBottom: '1px solid #E5E6E7',
    marginVertical: 15,
  },
  dividerAccent: {
    borderBottom: '2px solid #E51913',
    marginVertical: 15,
    width: 60,
  },

  // ===== INFO ROWS =====
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottom: '1px solid #F5F6F7',
  },
  label: {
    fontSize: 9,
    color: '#8A8C8E',
    fontWeight: 500,
  },
  value: {
    fontSize: 9,
    color: '#4A4C4E',
    fontWeight: 600,
  },

  // ===== AMOUNT DISPLAY =====
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F6F7',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4A4C4E',
  },
  amountValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E51913',
  },
  amountCurrency: {
    fontSize: 12,
    color: '#8A8C8E',
    fontWeight: '500',
  },

  // ===== TABLE =====
  table: {
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F6F7',
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: '#F5F6F7',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#E51913',
  },
  tableCol1: {
    width: '40%',
    fontSize: 9,
    color: '#4A4C4E',
  },
  tableCol2: {
    width: '30%',
    fontSize: 9,
    color: '#4A4C4E',
  },
  tableCol3: {
    width: '30%',
    fontSize: 9,
    color: '#4A4C4E',
    textAlign: 'right',
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#4A4C4E',
    letterSpacing: 0.5,
  },

  // ===== FOOTER =====
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTop: '2px solid #E51913',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#8A8C8E',
    textAlign: 'center',
    marginVertical: 2,
  },
  footerHighlight: {
    fontSize: 10,
    color: '#E51913',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
    fontStyle: 'italic',
  },
  footerSmall: {
    fontSize: 7,
    color: '#8A8C8E',
    textAlign: 'center',
    marginVertical: 2,
  },

  // ===== OFFICIAL STAMP =====
  stampContainer: {
    marginTop: 15,
    padding: 12,
    border: '1px solid #E51913',
    borderRadius: 6,
    alignItems: 'center',
    width: '60%',
    alignSelf: 'flex-end',
  },
  stampText: {
    fontSize: 8,
    color: '#E51913',
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  stampSubText: {
    fontSize: 6,
    color: '#8A8C8E',
    textAlign: 'center',
    marginTop: 3,
  },

  // ===== WATERMARK =====
  watermark: {
    position: 'absolute',
    top: '35%',
    left: '15%',
    fontSize: 65,
    opacity: 0.02,
    transform: 'rotate(-30deg)',
    color: '#E51913',
    fontWeight: 'bold',
    letterSpacing: 8,
  },

  // ===== BADGE ICON =====
  badgeIcon: {
    width: 12,
    height: 12,
    borderRadius: 12,
    marginRight: 4,
  },
  badgeIconSuccess: {
    backgroundColor: '#059669',
  },
});

export function ReceiptPDF({ data }) {
  const {
    receiptNumber,
    reference,
    amount,
    date,
    partnerName,
    partnerEmail,
    partnerPhone,
    purpose,
    method,
    status,
    partnershipType,
    address,
  } = data;

  const isSuccess = status === 'success';
  const isPending = status === 'pending';
  const isFailed = status === 'failed';

  const getStatusStyle = () => {
    if (isSuccess) return styles.statusBadgeSuccess;
    if (isPending) return styles.statusBadgePending;
    return styles.statusBadgeFailed;
  };

  const getStatusTextStyle = () => {
    if (isSuccess) return styles.statusTextSuccess;
    if (isPending) return styles.statusTextPending;
    return styles.statusTextFailed;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <Text style={styles.watermark}>EXOUSIA</Text>

        {/* ===== HEADER ===== */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>EX</Text>
            </View>
            <View>
              <Text style={styles.ministryName}>Exousia Fellowship</Text>
              <Text style={styles.ministrySub}>Advancing the Gospel Worldwide</Text>
              <Text style={styles.ministrySub}>39 Commercial Layout, Damboa Road</Text>
              <Text style={styles.ministrySub}>Maiduguri, Borno State, Nigeria</Text>
            </View>
          </View>
          <View style={styles.receiptTitleContainer}>
            <Text style={styles.receiptTitle}>OFFICIAL RECEIPT</Text>
            <Text style={styles.receiptNumber}>#{receiptNumber}</Text>
          </View>
        </View>

        {/* ===== STATUS BADGE ===== */}
        <View style={[styles.statusBadge, getStatusStyle()]}>
          <Text style={[styles.statusText, getStatusTextStyle()]}>
            {status.toUpperCase()}
          </Text>
        </View>

        {/* ===== PARTNER INFORMATION ===== */}
        <View>
          <Text style={styles.sectionTitle}>Partner Information</Text>
          <View style={styles.sectionTitleAccent} />
          <View style={{ marginTop: 8 }}>
            <View style={styles.row}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{partnerName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{partnerEmail}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>{partnerPhone || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Partnership Type</Text>
              <Text style={styles.value}>{partnershipType || 'SILVER'}</Text>
            </View>
            {address && (
              <View style={styles.row}>
                <Text style={styles.label}>Address</Text>
                <Text style={styles.value}>{address}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.divider} />

        {/* ===== TRANSACTION DETAILS ===== */}
        <View>
          <Text style={styles.sectionTitle}>Transaction Details</Text>
          <View style={styles.sectionTitleAccent} />
          <View style={{ marginTop: 8 }}>
            <View style={styles.row}>
              <Text style={styles.label}>Reference</Text>
              <Text style={styles.value}>{reference}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{date}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Purpose</Text>
              <Text style={styles.value}>{purpose || 'Monthly Partnership'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Payment Method</Text>
              <Text style={styles.value}>{method || 'Card'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* ===== AMOUNT ===== */}
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.amountValue}>₦{amount.toLocaleString()}</Text>
            <Text style={styles.amountCurrency}>NGN</Text>
          </View>
        </View>

        {/* ===== PAYMENT BREAKDOWN ===== */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCol1, styles.tableHeaderText]}>Description</Text>
            <Text style={[styles.tableCol2, styles.tableHeaderText]}>Type</Text>
            <Text style={[styles.tableCol3, styles.tableHeaderText]}>Amount</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol1}>{purpose || 'Monthly Partnership'}</Text>
            <Text style={styles.tableCol2}>Partnership</Text>
            <Text style={styles.tableCol3}>₦{amount.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.dividerAccent} />

        {/* ===== FOOTER ===== */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This is an official receipt issued by Exousia Fellowship Incorporated.
          </Text>
          <Text style={styles.footerText}>
            Thank you for your faithful partnership in advancing the Gospel.
          </Text>
          <Text style={styles.footerHighlight}>
            "God loves a cheerful giver"
          </Text>
          <Text style={styles.footerSmall}>
            © {new Date().getFullYear()} Exousia Fellowship Incorporated
          </Text>
        </View>

        {/* ===== OFFICIAL STAMP ===== */}
        <View style={styles.stampContainer}>
          <Text style={styles.stampText}>OFFICIAL RECEIPT</Text>
          <Text style={styles.stampSubText}>This is a computer-generated receipt</Text>
          <Text style={styles.stampSubText}>No signature required</Text>
        </View>
      </Page>
    </Document>
  );
}