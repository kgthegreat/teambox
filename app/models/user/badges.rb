class User

  def badges
    settings['badges'] || []
  end

  def grant_badge(badge)
    write_setting 'badges',
      badges.push(badge).uniq
  end

end
