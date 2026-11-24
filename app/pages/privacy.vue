<script setup lang="ts">
useHead({
  title: 'Privasi & Keamanan Anak - Bimbiu',
})

const sections = [
  {
    num: '1',
    title: 'Data Minimal yang Kami Simpan',
    body: 'Bimbiu hanya menyimpan identitas akun Google untuk login, nama tampilan (nickname), avatar pilihan dari katalog lokal, serta riwayat progres kuis, XP, dan badge milikmu. Kami tidak meminta foto pribadi, alamat rumah, tanggal lahir lengkap, atau nama sekolah.',
  },
  {
    num: '2',
    title: 'Tanpa Fitur Sosial, Iklan, atau Ranking Publik',
    body: 'Tidak ada obrolan antar pengguna, profil publik, maupun papan peringkat global. Progres belajarmu hanya dapat dilihat oleh akunmu sendiri.',
  },
  {
    num: '3',
    title: 'Pengelolaan dan Penghapusan Data',
    body: 'Pengaturan akun dan penghapusan data mengikuti ketentuan pelindungan anak yang berlaku. Orang tua atau wali dapat mendampingi anak saat menghubungkan akun Google.',
  },
]
</script>

<template>
  <section class="privacy-page">
    <div class="privacy-page__top">
      <h1 class="privacy-page__title">
        Privasi &amp; Keamanan Anak di Bimbiu
      </h1>
    </div>

    <div class="privacy-page__list">
      <AppCard v-for="sec in sections" :key="sec.num" padding="lg" class="privacy-page__card">
        <div class="privacy-page__card-head">
          <span class="privacy-page__num-badge">{{ sec.num }}</span>
          <AppIcon name="shield" :size="20" class="privacy-page__shield" />
          <h2 class="privacy-page__card-title">
            {{ sec.title }}
          </h2>
        </div>
        <p class="privacy-page__card-body">
          {{ sec.body }}
        </p>
      </AppCard>
    </div>
  </section>
</template>

<style scoped>
.privacy-page {
  max-width: 760px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4) var(--space-12);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.privacy-page__top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.privacy-page__title {
  font-size: var(--text-h1);
}

.privacy-page__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.privacy-page__card {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.privacy-page__card-head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.privacy-page__num-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  background-color: var(--action-primary-tint);
  border: 1.5px solid var(--action-primary);
  border-radius: var(--radius-sm);
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  color: var(--action-primary);
}

.privacy-page__shield {
  flex-shrink: 0;
  color: var(--action-primary);
}

.privacy-page__card-title {
  font-size: 20px;
  font-weight: 700;
}

.privacy-page__card-body {
  color: var(--text-secondary);
}
</style>
