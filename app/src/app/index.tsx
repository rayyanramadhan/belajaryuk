import { Link, router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { colors, radius, spacing, type } from "@/lib/theme";

const FEATURE_ROW_GAP = spacing[3];

export default function LandingScreen() {
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
      {/* Nav */}
      <View style={styles.nav}>
        <Text style={styles.wordmark}>belajaryuk</Text>
        <View style={styles.navLinks}>
          <Text style={styles.navLink}>English</Text>
          <Text style={styles.navLink}>Parenting</Text>
          <Link href="/login" style={styles.navLink}>
            Log in
          </Link>
          <Pressable onPress={() => router.push("/signup")} style={styles.navCta}>
            <Text style={styles.navCtaText}>Sign up free</Text>
          </Pressable>
        </View>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>
            Two things worth learning. One place to learn them.
          </Text>
          <Text style={styles.heroSubtitle}>
            Bite-sized English lessons that build a daily streak, and self-paced Parenting video
            courses you can watch whenever you&apos;re ready — both in one app.
          </Text>
          <View style={styles.heroActions}>
            <View style={styles.heroActionPrimary}>
              <Button label="Start learning free" onPress={() => router.push("/signup")} />
            </View>
            <View style={styles.heroActionSecondary}>
              <Button label="See how it works" variant="secondary" onPress={() => {}} />
            </View>
          </View>
        </View>

        <View style={styles.heroPreviews}>
          <Card variant="english-accent" style={styles.previewCard}>
            <View style={[styles.iconChip, { backgroundColor: colors.englishTint }]}>
              <Text style={styles.iconChipText}>🔥</Text>
            </View>
            <Text style={styles.previewTitle}>7-day streak</Text>
            <Text style={styles.previewBody}>&quot;Keep your streak alive&quot; — 2 lessons today</Text>
            <ProgressBar percent={70} trackColor={colors.englishTint} fillColor={colors.english} />
          </Card>

          <Card variant="parenting-accent" style={styles.previewCard}>
            <View style={[styles.iconChip, { backgroundColor: colors.parentingTint }]}>
              <Text style={styles.iconChipText}>▶</Text>
            </View>
            <Text style={styles.previewTitle}>Toddler sleep, Ep. 3</Text>
            <Text style={styles.previewBody}>Finish this lesson when you&apos;re ready — no streak to lose</Text>
            <ProgressBar percent={40} trackColor={colors.parentingTint} fillColor={colors.parenting} />
          </Card>
        </View>
      </View>

      {/* English track section */}
      <View style={[styles.trackSection, { backgroundColor: colors.englishTint }]}>
        <View style={styles.trackCopy}>
          <TrackBadge icon="🔥" label="English track" color={colors.english} />
          <Text style={styles.trackTitle}>Bite-sized lessons, built to become a habit.</Text>
          <FeatureList
            items={[
              [
                "🔥",
                "Daily streaks keep you coming back — miss a day and we'll tell you honestly, not guilt you.",
              ],
              ["⏱️", "Each lesson is 3–5 minutes — speaking, listening and quick quizzes."],
              ["📈", "Progress bars and streak counters make momentum visible, not stressful."],
            ]}
          />
          <View style={styles.trackCtaWrap}>
            <Button
              label="Start the English track"
              variant="track-english"
              onPress={() => router.push("/signup")}
            />
          </View>
        </View>

        <Card style={styles.trackPreviewCard}>
          <Text style={styles.previewTitle}>Today&apos;s lesson</Text>
          <View style={styles.lessonRow}>
            <View style={[styles.iconChip, { backgroundColor: colors.englishTint }]}>
              <Text style={styles.iconChipText}>🗣️</Text>
            </View>
            <View>
              <Text style={styles.lessonName}>Ordering coffee</Text>
              <Text style={styles.lessonMeta}>Lesson 14 · Speaking</Text>
            </View>
          </View>
          <ProgressBar percent={55} trackColor={colors.englishTint} fillColor={colors.english} />
          <Text style={styles.lessonMeta}>4 of 7 streaks this week</Text>
        </Card>
      </View>

      {/* Parenting track section */}
      <View style={[styles.trackSection, { backgroundColor: colors.parentingTint }]}>
        <Card style={styles.trackPreviewCard}>
          <Text style={styles.previewTitle}>Up next</Text>
          <View style={styles.lessonRow}>
            <View style={[styles.iconChip, { backgroundColor: colors.parentingTint }]}>
              <Text style={styles.iconChipText}>▶</Text>
            </View>
            <View>
              <Text style={styles.lessonName}>Handling tantrums, Ep. 2</Text>
              <Text style={styles.lessonMeta}>12 min · Quiz included</Text>
            </View>
          </View>
          <ProgressBar percent={20} trackColor={colors.parentingTint} fillColor={colors.parenting} />
          <Text style={styles.lessonMeta}>Watch at your own pace — pick up anytime</Text>
        </Card>

        <View style={styles.trackCopy}>
          <TrackBadge icon="▶" label="Parenting track" color={colors.parenting} />
          <Text style={styles.trackTitle}>Video lessons you watch on your own schedule.</Text>
          <FeatureList
            items={[
              ["🎬", "Short expert-led videos on real parenting moments — sleep, tantrums, screen time."],
              ["📝", "A short quiz after each video checks what stuck, never what you forgot."],
              ["🕊️", "No streaks, no pressure — pause a course for a month and pick it back up."],
            ]}
          />
          <View style={styles.trackCtaWrap}>
            <Button
              label="Start the Parenting track"
              variant="track-parenting"
              onPress={() => router.push("/signup")}
            />
          </View>
        </View>
      </View>

      {/* Social proof */}
      <View style={styles.testimonialSection}>
        <Text style={styles.sectionTitle}>Learners like it here</Text>
        <View style={styles.testimonialRow}>
          <Card style={styles.testimonialCard}>
            <Text style={styles.testimonialQuote}>
              &quot;I finally stuck with a habit for more than a week. The streak is weirdly
              motivating.&quot;
            </Text>
            <Text style={styles.testimonialAttribution}>— Dinda, English learner</Text>
          </Card>
          <Card style={styles.testimonialCard}>
            <Text style={styles.testimonialQuote}>
              &quot;No pressure to finish on a schedule. I watch one lesson a week, whenever my son
              naps.&quot;
            </Text>
            <Text style={styles.testimonialAttribution}>— Reza, Parenting learner</Text>
          </Card>
        </View>
      </View>

      {/* Final CTA band */}
      <View style={styles.ctaBand}>
        <View style={styles.ctaBandCopy}>
          <Text style={styles.ctaBandTitle}>Pick your track. Start today.</Text>
          <Text style={styles.ctaBandSubtitle}>
            Free to join — switch tracks or do both, whenever you want.
          </Text>
        </View>
        <View style={styles.ctaBandButton}>
          <Button
            label="Create your free account"
            variant="secondary"
            onPress={() => router.push("/signup")}
          />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerCopyright}>© 2026 belajaryuk</Text>
        <View style={styles.footerLinks}>
          <Text style={styles.footerLink}>English</Text>
          <Text style={styles.footerLink}>Parenting</Text>
          <Link href="/login" style={styles.footerLink}>
            Log in
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

function TrackBadge({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <View style={styles.trackBadge}>
      <View style={[styles.trackBadgeIcon, { backgroundColor: color }]}>
        <Text style={styles.trackBadgeIconText}>{icon}</Text>
      </View>
      <Text style={styles.trackBadgeLabel}>{label}</Text>
    </View>
  );
}

function FeatureList({ items }: { items: [string, string][] }) {
  return (
    <View style={{ gap: spacing[4] }}>
      {items.map(([icon, text]) => (
        <View key={text} style={styles.featureItem}>
          <Text style={styles.featureIcon}>{icon}</Text>
          <Text style={styles.featureText}>{text}</Text>
        </View>
      ))}
    </View>
  );
}

function ProgressBar({
  percent,
  trackColor,
  fillColor,
}: {
  percent: number;
  trackColor: string;
  fillColor: string;
}) {
  return (
    <View style={[styles.progressTrack, { backgroundColor: trackColor }]}>
      <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: fillColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.paper },
  scroll: { width: "100%", maxWidth: 1440, alignSelf: "center" },

  nav: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing[4],
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[6],
    borderBottomWidth: 1,
    borderBottomColor: colors.mist,
  },
  wordmark: { fontSize: type.h2.fontSize, fontWeight: "800", color: colors.ink },
  navLinks: { flexDirection: "row", alignItems: "center", gap: spacing[6], flexWrap: "wrap" },
  navLink: {
    fontSize: type.bodyMedium.fontSize,
    fontWeight: type.bodyMedium.fontWeight,
    color: colors.ink,
  },
  navCta: {
    height: 48,
    paddingHorizontal: spacing[6],
    borderRadius: radius.md,
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  navCtaText: { color: colors.surface, fontSize: type.bodyMedium.fontSize, fontWeight: "500" },

  hero: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing[12],
    padding: spacing[16],
  },
  heroCopy: { flexGrow: 1, flexBasis: 440, gap: spacing[6] },
  heroTitle: { fontSize: type.display.fontSize, lineHeight: type.display.lineHeight, fontWeight: "800", color: colors.ink },
  heroSubtitle: { fontSize: type.bodyLg.fontSize, lineHeight: type.bodyLg.lineHeight, color: colors.muted, maxWidth: 460 },
  heroActions: { flexDirection: "row", flexWrap: "wrap", gap: spacing[4] },
  heroActionPrimary: { minWidth: 200 },
  heroActionSecondary: { minWidth: 200 },
  heroPreviews: { flexGrow: 1, flexBasis: 440, flexDirection: "row", flexWrap: "wrap", gap: FEATURE_ROW_GAP + spacing[4] },
  previewCard: { flexGrow: 1, flexBasis: 200, minWidth: 180 },
  previewTitle: { fontSize: type.h3.fontSize, fontWeight: type.h3.fontWeight, color: colors.ink },
  previewBody: { fontSize: type.caption.fontSize, color: colors.muted },
  iconChip: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  iconChipText: { fontSize: 20 },
  progressTrack: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },

  trackSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing[12],
    padding: spacing[16],
  },
  trackCopy: { flexGrow: 1, flexBasis: 440, gap: spacing[5] },
  trackBadge: { flexDirection: "row", alignItems: "center", gap: spacing[2] },
  trackBadgeIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  trackBadgeIconText: { fontSize: 14 },
  trackBadgeLabel: {
    fontSize: type.caption.fontSize,
    fontWeight: "600",
    color: colors.ink,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  trackTitle: { fontSize: type.h1.fontSize, lineHeight: type.h1.lineHeight, fontWeight: "700", color: colors.ink },
  featureItem: { flexDirection: "row", gap: spacing[3] },
  featureIcon: { fontSize: type.body.fontSize },
  featureText: { flex: 1, fontSize: type.body.fontSize, lineHeight: type.body.lineHeight, color: colors.ink },
  trackCtaWrap: { maxWidth: 280 },
  trackPreviewCard: { flexGrow: 1, flexBasis: 380, minWidth: 280 },
  lessonRow: { flexDirection: "row", alignItems: "center", gap: spacing[3] },
  lessonName: { fontSize: type.bodyMedium.fontSize, fontWeight: "600", color: colors.ink },
  lessonMeta: { fontSize: type.caption.fontSize, color: colors.muted },

  testimonialSection: { padding: spacing[16], gap: spacing[8] },
  sectionTitle: { fontSize: type.h1.fontSize, lineHeight: type.h1.lineHeight, fontWeight: "700", color: colors.ink, textAlign: "center" },
  testimonialRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing[6], justifyContent: "center" },
  testimonialCard: { flexGrow: 1, flexBasis: 320, maxWidth: 400 },
  testimonialQuote: { fontSize: type.body.fontSize, lineHeight: type.body.lineHeight, color: colors.ink },
  testimonialAttribution: { fontSize: type.caption.fontSize, fontWeight: "500", color: colors.muted },

  ctaBand: {
    marginHorizontal: spacing[16],
    marginBottom: spacing[16],
    borderRadius: radius.lg,
    backgroundColor: colors.ink,
    padding: spacing[16],
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing[6],
  },
  ctaBandCopy: { flexGrow: 1, flexBasis: 320, maxWidth: 520, gap: spacing[2] },
  ctaBandTitle: { fontSize: type.h1.fontSize, lineHeight: type.h1.lineHeight, fontWeight: "700", color: colors.surface },
  ctaBandSubtitle: { fontSize: type.body.fontSize, color: colors.mist },
  ctaBandButton: { minWidth: 240 },

  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing[4],
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[6],
    borderTopWidth: 1,
    borderTopColor: colors.mist,
  },
  footerCopyright: { fontSize: type.caption.fontSize, color: colors.muted },
  footerLinks: { flexDirection: "row", gap: spacing[6], flexWrap: "wrap" },
  footerLink: { fontSize: type.caption.fontSize, color: colors.muted },
});
