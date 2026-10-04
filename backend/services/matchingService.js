const calculateSkillMatch = (requiredSkills, candidateSkills) => {
  if (!requiredSkills || requiredSkills.length === 0) {
    return {
      percentage: 0,
      matchedSkills: [],
      missingSkills: [],
    };
  }

  const candidateSkillNames = candidateSkills.map((skill) =>
    skill.toLowerCase().trim(),
  );

  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach((skill) => {
    const normalizedSkill = skill.toLowerCase().trim();

    const isMatched = candidateSkillNames.some(
      (candidateSkill) =>
        candidateSkill === normalizedSkill ||
        candidateSkill.includes(normalizedSkill) ||
        normalizedSkill.includes(candidateSkill),
    );

    if (isMatched) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const percentage = (matchedSkills.length / requiredSkills.length) * 100;

  return {
    percentage: Math.round(percentage),
    matchedSkills,
    missingSkills,
  };
};

const calculateExperienceMatch = (requiredExperience, candidateExperience) => {
  if (!requiredExperience || requiredExperience <= 0) {
    return 100;
  }

  if (candidateExperience >= requiredExperience) {
    return 100;
  }

  const percentage = (candidateExperience / requiredExperience) * 100;

  return Math.round(percentage);
};

const calculateEducationMatch = (education) => {
  if (!education || education.trim() === "") {
    return 0;
  }

  return 100;
};

const generateExplanation = ({
  score,
  skillMatch,
  experienceMatch,
  educationMatch,
  matchedSkills,
  missingSkills,
  requiredExperience,
  candidateExperience,
}) => {
  const parts = [];

  // Overall score
  if (score >= 80) {
    parts.push(`Strong overall match with a score of ${score}%.`);
  } else if (score >= 60) {
    parts.push(`Good overall match with a score of ${score}%.`);
  } else if (score >= 40) {
    parts.push(`Moderate overall match with a score of ${score}%.`);
  } else {
    parts.push(`Low overall match with a score of ${score}%.`);
  }

  // Skills
  if (matchedSkills.length > 0) {
    parts.push(
      `The candidate matches ${matchedSkills.length} required skill${
        matchedSkills.length === 1 ? "" : "s"
      }: ${matchedSkills.join(", ")}.`,
    );
  } else {
    parts.push("The candidate does not match any of the required skills.");
  }

  if (missingSkills.length > 0) {
    parts.push(`Missing required skills: ${missingSkills.join(", ")}.`);
  }

  // Experience
  if (requiredExperience > 0) {
    if (candidateExperience >= requiredExperience) {
      parts.push(
        `The candidate has ${candidateExperience} year${
          candidateExperience === 1 ? "" : "s"
        } of experience, meeting the required ${requiredExperience} year${
          requiredExperience === 1 ? "" : "s"
        }.`,
      );
    } else {
      parts.push(
        `The candidate has ${candidateExperience} year${
          candidateExperience === 1 ? "" : "s"
        } of experience compared with the required ${requiredExperience} year${
          requiredExperience === 1 ? "" : "s"
        }.`,
      );
    }
  } else {
    parts.push("No specific experience requirement was provided for this job.");
  }

  // Education
  if (educationMatch === 100) {
    parts.push("Education information is available in the candidate's resume.");
  } else {
    parts.push(
      "Education information was not available in the candidate's resume.",
    );
  }

  // Score components
  parts.push(
    `Score breakdown: Skills ${skillMatch}% (60% weight), Experience ${experienceMatch}% (25% weight), Education ${educationMatch}% (15% weight).`,
  );

  return parts.join(" ");
};

const calculateMatch = (job, resume) => {
  const skillResult = calculateSkillMatch(job.requiredSkills, resume.skills);

  const experienceMatch = calculateExperienceMatch(
    job.experienceRequired,
    resume.experience,
  );

  const educationMatch = calculateEducationMatch(resume.education);

  const finalScore =
    skillResult.percentage * 0.6 +
    experienceMatch * 0.25 +
    educationMatch * 0.15;

  const score = Math.round(finalScore);

  const explanation = generateExplanation({
    score,
    skillMatch: skillResult.percentage,
    experienceMatch,
    educationMatch,
    matchedSkills: skillResult.matchedSkills,
    missingSkills: skillResult.missingSkills,
    requiredExperience: job.experienceRequired,
    candidateExperience: resume.experience,
  });

  return {
    score,
    skillMatch: skillResult.percentage,
    experienceMatch,
    educationMatch,
    matchedSkills: skillResult.matchedSkills,
    missingSkills: skillResult.missingSkills,
    explanation,
  };
};

export default calculateMatch;
